import { Injectable } from '@nestjs/common'
import get from 'lodash/get'

import { OrganisationsApi } from '@island.is/clients/document-provider'
import { logger } from '@island.is/logging'

import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'

import {
  generateApplicationApprovedEmail,
  generateApplicationRejectedEmail,
  generateAssignReviewerEmail,
} from './emailGenerators'

interface Contact {
  name: string
  email: string
  phoneNumber: string
}

interface Applicant extends Contact {
  nationalId: string
  address: string
}

interface Helpdesk {
  email: string
  phoneNumber: string
}

const ONE_DAY_IN_SECONDS_EXPIRES = 24 * 60 * 60

@Injectable()
export class DocumentProviderOnboardingService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private organisationsApi: OrganisationsApi,
  ) {}

  async assignReviewer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignReviewerEmail,
      application,
      ONE_DAY_IN_SECONDS_EXPIRES,
    )
  }

  async applicationApproved({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const applicant = (get(
        application.answers,
        'applicant',
      ) as unknown) as Applicant
      const adminContact = (get(
        application.answers,
        'administrativeContact',
      ) as unknown) as Contact
      const techContact = (get(
        application.answers,
        'technicalContact',
      ) as unknown) as Contact
      const helpdesk = (get(
        application.answers,
        'helpDesk',
      ) as unknown) as Helpdesk

      const dto = {
        createOrganisationDto: {
          ...applicant,
          administrativeContact: { ...adminContact },
          technicalContact: { ...techContact },
          helpdesk: { ...helpdesk },
        },
        authorization: auth.authorization,
      }

      await this.organisationsApi.organisationControllerCreateOrganisation(dto)
    } catch (error) {
      logger.error('Failed to create organisation', error)
      throw error
    }

    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async applicationRejected({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationRejectedEmail,
      application,
    )
  }
}
