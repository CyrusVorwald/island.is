import { Args, Mutation,Query, Resolver } from '@nestjs/graphql'

import { Authorize, CurrentUser, User } from '../auth'

import { GdprModel } from './gdpr.model'
import { GdprService } from './gdpr.service'

@Authorize()
@Resolver(() => GdprModel)
export class GdprResolver {
  constructor(private gdprService: GdprService) {}

  @Mutation((_) => Boolean)
  async createSkilavottordGdpr(
    @CurrentUser() user: User,
    @Args('gdprStatus') gdprStatus: string,
  ): Promise<boolean> {
    await this.gdprService.createGdpr(user.nationalId, gdprStatus)
    return true
  }

  @Query(() => GdprModel, { nullable: true })
  async skilavottordGdpr(@CurrentUser() user: User): Promise<GdprModel> {
    return await this.gdprService.findByNationalId(user.nationalId)
  }

  @Query(() => [GdprModel])
  async skilavottordAllGdprs(): Promise<GdprModel[]> {
    const res = this.gdprService.findAll()
    return res
  }
}
