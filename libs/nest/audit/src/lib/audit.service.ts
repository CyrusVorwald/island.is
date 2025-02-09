import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'
import { TransformableInfo } from 'logform'
import { createHash } from 'crypto'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Auth } from '@island.is/auth-nest-tools'
import type { AuditOptions } from './audit.options'
import { AUDIT_OPTIONS } from './audit.options'

export interface AuditMessage {
  auth: Auth
  action: string
  namespace?: string
  resources?: string | string[]
  meta?: Record<string, unknown>
}

export type AuditTemplate<ResultType> = {
  auth: Auth
  action: string
  namespace?: string
  resources?: string | string[] | ((result: ResultType) => string | string[])
  meta?:
    | Record<string, unknown>
    | ((result: ResultType) => Record<string, unknown>)
}

@Injectable()
export class AuditService {
  private auditLog?: Logger
  private useDevLogger: boolean
  private defaultNamespace?: string

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(AUDIT_OPTIONS)
    private options: AuditOptions,
  ) {
    this.useDevLogger =
      options.groupName === undefined && process.env.NODE_ENV !== 'production'
    this.defaultNamespace = options.defaultNamespace

    if (this.useDevLogger) {
      this.logger.info('Using generic logger for audit')

      this.auditLog = this.logger
    } else {
      if (!options.groupName || !options.serviceName) {
        throw new Error('Audit service is not configured.')
      }

      this.logger.info(
        `Creating a dedicated logger for audit trail ${options.groupName}<<<${options.serviceName}`,
      )

      // Create a log stream with a randomized (time-based) hash so that multiple
      // instances of the service don't log to the same stream.
      const startTime = new Date().toISOString()
      const processHash = createHash('md5').update(startTime).digest('hex')
      this.auditLog = winston.createLogger({
        transports: [
          new WinstonCloudWatch({
            name: 'CloudWatch',
            logGroupName: options.groupName,
            messageFormatter: (info: TransformableInfo) => {
              // Flatten message to avoid top level object with "level" and "message".
              return JSON.stringify(info.message)
            },
            logStreamName: function () {
              // Spread log streams across dates
              const date = new Date().toISOString().split('T')[0]
              return `${options.serviceName}-${date}-${processHash}`
            },
          }),
        ],
      })
    }
  }

  private getClients(auth: Auth) {
    const clients: string[] = []
    let act = auth.act
    while (act) {
      clients.unshift(act.client_id)
      act = act.act
    }
    clients.unshift(auth.client)
    return clients
  }

  private formatMessage({
    auth,
    namespace = this.defaultNamespace,
    action,
    resources,
    meta,
  }: AuditMessage) {
    if (!namespace) {
      throw new Error(
        'Audit namespace is required. Did you configure a defaultNamespace?',
      )
    }
    const message = {
      subject: auth.nationalId,
      actor: auth.actor ? auth.actor.nationalId : auth.nationalId,
      client: this.getClients(auth),
      action: `${namespace}#${action}`,
      resources:
        resources && (typeof resources === 'string' ? [resources] : resources),
      meta,
      ip: auth.ip,
      userAgent: auth.userAgent,
      appVersion: process.env.APP_VERSION,
    }

    return this.useDevLogger ? { message: 'Audit record', ...message } : message
  }

  private unwrap<PropType, ResultType>(prop: PropType, result: ResultType) {
    return typeof prop === 'function' ? prop(result) : prop
  }

  audit(message: AuditMessage) {
    this.auditLog?.info(this.formatMessage(message))
  }

  auditPromise<ResultType>(
    template: AuditTemplate<ResultType>,
    promise: Promise<ResultType>,
  ): Promise<ResultType> {
    return promise.then((result) => {
      const message: AuditMessage = {
        auth: template.auth,
        action: template.action,
        namespace: template.namespace,
        resources: this.unwrap(template.resources, result),
        meta: this.unwrap(template.meta, result),
      }
      this.auditLog?.info(this.formatMessage(message))
      return result
    })
  }
}
