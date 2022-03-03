import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { getCurrentAuth } from '@island.is/auth-nest-tools'

import { AUDIT_METADATA_KEY } from './audit.decorator'
import { AuditService, AuditTemplate } from './audit.service'

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler()
    const decorators = this.reflector.getAll(AUDIT_METADATA_KEY, [
      handler,
      context.getClass(),
    ]) as Array<Partial<AuditTemplate<unknown>> | undefined>

    // Should decorate the handler to perform audit. Not enough to decorate just the class.
    if (decorators[0] === undefined) {
      return next.handle()
    }

    const auth = getCurrentAuth(context)
    const template = {
      action: handler.name,
      ...decorators[0],
      ...decorators[1],
    }

    return next.handle().pipe(
      tap((result: unknown) => {
        this.auditService.auditPromise(
          {
            ...template,
            auth,
          },
          Promise.resolve(result),
        )
      }),
    )
  }
}
