import { Inject, UseGuards } from '@nestjs/common'
import { Args,Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  Application,
  ApplicationFilters,
  UpdateApplicationTableResponseType,
} from '@island.is/financial-aid/shared/lib'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import {
  AllApplicationInput,
  ApplicationInput,
  ApplicationSearchInput,
  CreateApplicationEventInput,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationInputTable,
} from './dto'
import {
  ApplicationFiltersModel,
  ApplicationModel,
  UpdateApplicationTableResponse,
} from './models'

@UseGuards(IdsUserGuard)
@Resolver(() => ApplicationModel)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [ApplicationModel], { nullable: false })
  applications(
    @Args('input', { type: () => AllApplicationInput })
    input: AllApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application[]> {
    this.logger.debug('Getting all applications')

    return backendApi.getApplications(input.stateUrl)
  }

  @Query(() => ApplicationModel, { nullable: false })
  application(
    @Args('input', { type: () => ApplicationInput })
    input: ApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    this.logger.debug(`Getting application ${input.id}`)

    return backendApi.getApplication(input.id)
  }

  @Query(() => [ApplicationModel], { nullable: false })
  applicationSearch(
    @Args('input', { type: () => ApplicationSearchInput })
    input: ApplicationSearchInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application[]> {
    this.logger.debug(`searching for application`)

    return backendApi.searchForApplication(input.nationalId)
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    this.logger.debug('Creating application')
    return backendApi.createApplication(input)
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  updateApplication(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    const { id, ...updateApplication } = input
    this.logger.debug(`updating application ${id}`)
    return backendApi.updateApplication(id, updateApplication)
  }

  @Mutation(() => UpdateApplicationTableResponse, { nullable: true })
  updateApplicationTable(
    @Args('input', { type: () => UpdateApplicationInputTable })
    input: UpdateApplicationInputTable,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<UpdateApplicationTableResponseType> {
    const { id, stateUrl, ...updateApplication } = input

    this.logger.debug(`updating application table ${id}`)

    return backendApi.updateApplicationTable(id, stateUrl, updateApplication)
  }
  @Mutation(() => ApplicationFiltersModel, { nullable: false })
  applicationFilters(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationFilters> {
    this.logger.debug('Getting all applications filters')

    return backendApi.getApplicationFilters()
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  async createApplicationEvent(
    @Args('input', { type: () => CreateApplicationEventInput })
    input: CreateApplicationEventInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    this.logger.debug('Creating application event')

    return backendApi.createApplicationEvent(input)
  }
}
