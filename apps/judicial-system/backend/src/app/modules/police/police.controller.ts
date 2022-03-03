import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { prosecutorRule } from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseOriginalAncestorInterceptor,
  CaseReadGuard,
  CurrentCase,
} from '../case'

import { UploadPoliceCaseFileDto } from './dto/uploadPoliceCaseFile.dto'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { UploadPoliceCaseFileResponse } from './models/uploadPoliceCaseFile.response'
import { PoliceService } from './police.service'

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseNotCompletedGuard,
)
@Controller('api/case/:caseId')
@ApiTags('police files')
export class PoliceController {
  constructor(
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeFiles')
  @ApiOkResponse({
    type: PoliceCaseFile,
    isArray: true,
    description: 'Gets all police files for a case',
  })
  getAll(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<PoliceCaseFile[]> {
    this.logger.debug(`Getting all police files for case ${caseId}`)

    return this.policeService.getAllPoliceCaseFiles(theCase.id)
  }

  @RolesRules(prosecutorRule)
  @Post('policeFile')
  @ApiOkResponse({
    type: UploadPoliceCaseFileResponse,
    description: 'Uploads a police files of a case to AWS S3',
  })
  uploadPoliceCaseFile(
    @Param('caseId') caseId: string,
    @Body() uploadPoliceCaseFile: UploadPoliceCaseFileDto,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.logger.debug(
      `Uploading police file ${uploadPoliceCaseFile.id} of case ${caseId} to AWS S3`,
    )

    return this.policeService.uploadPoliceCaseFile(caseId, uploadPoliceCaseFile)
  }
}
