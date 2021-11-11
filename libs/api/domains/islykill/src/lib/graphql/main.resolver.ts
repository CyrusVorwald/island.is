import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { IslykillService } from '../islykill.service'

import { IslykillSettings } from './models/islykillSettings.model'
import { UpdateIslykillSettings } from './models/updateIslykillSettings.model'
import { CreateIslykillSettings } from './models/createIslykillSettings.model'
import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UpdateIslykillSettingsInput } from './dto/updateIslykillSettings.input'
import { CreateIslykillSettingsInput } from './dto/createIslykillSettings.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly islykillService: IslykillService) {}

  @Query(() => IslykillSettings)
  async getIslykillSettings(
    @CurrentUser() user: User,
  ): Promise<IslykillSettings> {
    return this.islykillService.getIslykillSettings(user.nationalId)
  }

  @Mutation(() => UpdateIslykillSettings)
  async updateIslykillSettings(
    @CurrentUser() user: User,
    @Args('input') input: UpdateIslykillSettingsInput,
  ) {
    return this.islykillService.updateIslykillSettings(user.nationalId, {
      email: input.email,
      mobile: input.mobile,
    })
  }

  @Mutation(() => CreateIslykillSettings)
  async createIslykillSettings(
    @CurrentUser() user: User,
    @Args('input') input: CreateIslykillSettingsInput,
  ) {
    return this.islykillService.createIslykillSettings(user.nationalId, {
      email: input.email,
      mobile: input.mobile,
    })
  }

  @Mutation(() => DeleteIslykillSettings)
  async deleteIslykillSettings(@CurrentUser() user: User) {
    return this.islykillService.deleteIslykillSettings(user.nationalId)
  }
}
