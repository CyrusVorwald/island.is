import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class DrivingInstructorGuard implements CanActivate {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    const teachingRights = await this.drivingLicenseService.getTeachingRights(
      user.nationalId,
    )
    return teachingRights.hasTeachingRights
  }
}
