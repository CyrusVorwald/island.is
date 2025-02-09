import {
  Body,
  Controller,
  Post,
  UseGuards,
  Inject,
  Param,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TokenGuard } from '@island.is/judicial-system/auth'

import { CaseEvent, EventService } from '../event'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CurrentCase } from './guards/case.decorator'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { Case } from './models/case.model'
import { ArchiveResponse } from './models/archive.response'
import { DeliverResponse } from './models/deliver.response'
import { CaseService } from './case.service'

@Controller('api/internal')
@ApiTags('internal cases')
@UseGuards(TokenGuard)
export class InternalCaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: InternalCreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.caseService.internalCreate(caseToCreate)

    this.eventService.postEvent(CaseEvent.CREATE_XRD, createdCase as Case)

    return createdCase
  }

  @Post('cases/archive')
  @ApiOkResponse({
    type: ArchiveResponse,
    description: 'Archives a single case if any case is ready to be archived',
  })
  archive(): Promise<ArchiveResponse> {
    this.logger.debug('Archiving a case')

    return this.caseService.archive()
  }

  @UseGuards(CaseExistsGuard, CaseCompletedGuard)
  @Post('case/:caseId/deliver')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a completed case to court',
  })
  deliver(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering case ${caseId}`)

    return this.caseService.deliver(theCase)
  }
}
