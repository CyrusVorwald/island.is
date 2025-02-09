import get from 'lodash/get'
import parse from 'date-fns/parse'
import parseISO from 'date-fns/parseISO'
import { logger } from '@island.is/logging'

import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import {
  ApplyHealthInsuranceInputs,
  VistaSkjalInput,
} from '@island.is/health-insurance'

const extractAnswer = <T>(object: unknown, key: string): T | null => {
  const value = get(object, key, null) as T | null | undefined
  if (value === undefined || value === null) {
    return null
  }
  return value
}

const extractAnswerFromJson = (object: unknown, key: string) => {
  const value: string | null = extractAnswer(object, key)
  if (value === undefined || value === null) {
    return null
  }
  return JSON.parse(value)
}

export const parseNationalRegistryDate = (dateString: string | null) => {
  if (typeof dateString !== 'string') {
    return undefined
  }

  // Icelandic format
  let parsedDate = parse(dateString, 'd.M.yyyy HH:mm:ss', new Date())
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  // ISO format (in the future hopefully)
  parsedDate = parseISO(dateString)
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  // Others
  return undefined
}

export const transformApplicationToHealthInsuranceDTO = (
  application: Application,
): ApplyHealthInsuranceInputs => {
  try {
    logger.info(`Start transform Application to Health Insurance DTO`)
    /*
     * Convert userStatus:
     * employed: 'O'
     * pensioner: 'P'
     * student: 'S'
     * other: 'O'
     */
    let userStatus = ''
    switch (extractAnswer(application.answers, 'status.type')) {
      case 'pensioner':
        userStatus = 'P'
        break
      case 'student':
        userStatus = 'S'
        break
      default:
        userStatus = 'O'
        break
    }

    // Extract attachments
    const arrFiles: string[] = Object.keys(application.attachments) ?? []
    if (userStatus == 'S' && arrFiles.length <= 0) {
      logger.error(
        `Student's application must have confirmation of student document`,
      )
      throw new Error(
        `Student's application must have confirmation of student document`,
      )
    }

    // There is 2 fields to add information in frontend
    // But there is only one tag in API
    // Merge 2 fields together
    let addInfo = ''
    if (extractAnswer(application.answers, 'additionalRemarks')) {
      addInfo += `Additional comments: ${extractAnswer(
        application.answers,
        'additionalRemarks',
      )}.`
    }
    if (
      extractAnswer(application.answers, 'formerInsurance.entitlementReason')
    ) {
      addInfo += `IsHealthInsuredInPreviousCountry reason: ${extractAnswer(
        application.answers,
        'formerInsurance.entitlementReason',
      )}`
    }

    const attachmentNames = Object.values(application.attachments) ?? []

    const vistaskjal: VistaSkjalInput = {
      applicationNumber: application.id,
      applicationDate: application.modified,
      nationalId: application.applicant,
      foreignNationalId:
        extractAnswer(application.answers, 'formerInsurance.personalId') ?? '',
      name: extractAnswer(application.answers, 'applicant.name') ?? '',
      address:
        extractAnswer(application.answers, 'applicant.address') ?? undefined,
      postalAddress:
        extractAnswer(application.answers, 'applicant.postalCode') ?? undefined,
      citizenship:
        extractAnswerFromJson(application.answers, 'applicant.citizenship')
          .name ?? undefined,
      email: extractAnswer(application.answers, 'applicant.email') ?? '',
      phoneNumber:
        extractAnswer(application.answers, 'applicant.phoneNumber') ?? '',
      // Registry date could be empty
      residenceDateFromNationalRegistry: parseNationalRegistryDate(
        extractAnswer(
          application.externalData,
          'nationalRegistry.data.address.lastUpdated',
        ),
      ),
      // Could not get this yet, so sent in empty
      residenceDateUserThink: undefined,
      userStatus: userStatus,
      isChildrenFollowed:
        extractAnswer(application.answers, 'children') == 'no' ? 0 : 1,
      previousCountry:
        extractAnswerFromJson(application.answers, 'formerInsurance.country')
          .name ?? '',
      previousCountryCode:
        extractAnswerFromJson(application.answers, 'formerInsurance.country')
          .countryCode ?? '',
      previousIssuingInstitution:
        extractAnswer(application.answers, 'formerInsurance.institution') ?? '',
      isHealthInsuredInPreviousCountry:
        extractAnswer(application.answers, 'formerInsurance.registration') ==
        'yes'
          ? 1
          : 0,
      hasHealthInsuranceRightInPreviousCountry:
        extractAnswer(application.answers, 'formerInsurance.entitlement') ==
        'yes'
          ? 1
          : 0,
      additionalInformation: addInfo,
      attachmentsFileNames: arrFiles,
    }

    return {
      vistaskjal: vistaskjal,
      attachmentNames,
    }
  } catch (error) {
    logger.error(`Failed to convert application's information: ${error}`)
    throw new Error(`Failed to convert application's information: ${error}`)
  }
}
