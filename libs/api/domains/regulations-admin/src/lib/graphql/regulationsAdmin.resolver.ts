import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { DeleteDraftRegulationInput } from './dto/deleteDraftRegulation.input'
import { EditDraftRegulationInput } from './dto/editDraftRegulation.input'
import { GetRegulationOptionListInput } from './dto/getRegulationOptionList.input'
import { DeleteDraftRegulationModel } from './models/deleteDraftRegulation.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client/regulationsAdmin.api'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
  ) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminApiService.getDraftRegulation(
      input.draftId,
      user.authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminApiService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() user: User) {
    return await this.regulationsAdminApiService.getDraftRegulations(
      user.authorization,
    )
  }

  // @Mutation(() => CreateDraftRegulationModel)
  @Mutation(() => graphqlTypeJson)
  async createDraftRegulation(
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(authorization ?? '')
  }

  // @Mutation(() => CreateDraftRegulationModel)
  @Mutation(() => graphqlTypeJson)
  async updateDraftRegulationById(
    @Args('input') input: EditDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.updateById(
      input.id,
      input.body,
      authorization ?? '',
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulation(
    @Args('input') input: DeleteDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    await this.regulationsAdminApiService.deleteById(
      input.draftId,
      authorization ?? '',
    )

    return {
      id: input.draftId,
    }
  }

  // @Query(() => [RegulationOptionList])
  @Query(() => graphqlTypeJson)
  async getRegulationOptionList(
    @Args('input') input: GetRegulationOptionListInput,
    @CurrentUser() { authorization }: User,
  ) {
    return await this.regulationsService.getRegulationOptionList(input.names)
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsMinistries(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsLawChapters(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsLawChapters(false)
  }
}
