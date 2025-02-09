import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { MortgageCertificateService } from '@island.is/api/domains/mortgage-certificate'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  MortgageCertificate,
} from '@island.is/clients/syslumenn'
import { generateSyslumennNotifyErrorEmail } from './emailGenerators/syslumennNotifyError'
import { generateSyslumennSubmitRequestErrorEmail } from './emailGenerators/syslumennSubmitRequestError'
import { Application } from '@island.is/application/types'
import {
  NationalRegistry,
  UserProfile,
  SubmitRequestToSyslumennResult,
  ValidateMortgageCertificateResult,
} from './types'
import { ChargeItemCode } from '@island.is/shared/constants'

@Injectable()
export class MortgageCertificateSubmissionService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly mortgageCertificateService: MortgageCertificateService,
    private readonly syslumennService: SyslumennService,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        id,
        ChargeItemCode.MORTGAGE_CERTIFICATE,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      return {
        success: false,
      }
    }

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (isPayment?.fulfilled) {
      return {
        success: true,
      }
    } else {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }
  }

  async validateMortgageCertificate({
    application,
  }: TemplateApiModuleActionProps): Promise<ValidateMortgageCertificateResult> {
    const { propertyNumber, isFromSearch } = application.answers
      .selectProperty as {
      propertyNumber: string
      isFromSearch: boolean
    }

    return {
      validation: await this.mortgageCertificateService.validateMortgageCertificate(
        propertyNumber,
        isFromSearch,
      ),
      propertyDetails: await this.syslumennService.getPropertyDetails(
        propertyNumber,
      ),
    }
  }

  async getMortgageCertificate({
    application,
  }: TemplateApiModuleActionProps): Promise<MortgageCertificate> {
    const { propertyNumber } = application.answers.selectProperty as {
      propertyNumber: string
    }
    const document = await this.mortgageCertificateService.getMortgageCertificate(
      propertyNumber,
    )

    // Call sýslumaður to get the document sealed before handing it over to the user
    const sealedDocumentResponse = await this.syslumennService.sealDocument(
      document.contentBase64,
    )

    if (!sealedDocumentResponse?.skjal) {
      throw new Error('Eitthvað fór úrskeiðis.')
    }

    const sealedDocument: MortgageCertificate = {
      contentBase64: sealedDocumentResponse.skjal,
    }

    // Notify Sýslumaður that person has received the mortgage certificate
    await this.notifySyslumenn(application, sealedDocument)

    return sealedDocument
  }

  private async notifySyslumenn(
    application: Application,
    document: MortgageCertificate,
  ) {
    const { propertyNumber } = application.answers.selectProperty as {
      propertyNumber: string
    }
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
    const userProfileData = application.externalData.userProfile
      ?.data as UserProfile

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: nationalRegistryData?.nationalId,
      phoneNumber: userProfileData?.mobilePhoneNumber,
      email: userProfileData?.email,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      city: nationalRegistryData?.address.city,
      signed: true,
      type: PersonType.MortgageCertificateApplicant,
    }
    const persons: Person[] = [person]

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    const attachments: Attachment[] = [
      {
        name: `vedbokarvottord_${nationalRegistryData?.nationalId}_${dateStr}.pdf`,
        content: document.contentBase64,
      },
    ]

    const extraData: { [key: string]: string } = {
      propertyNumber: propertyNumber,
    }

    const uploadDataName = 'Umsókn um veðbókarvottorð frá Ísland.is'
    const uploadDataId = 'Vedbokavottord1.0'

    await this.syslumennService
      .uploadData(persons, attachments, extraData, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennNotifyErrorEmail,
          (application as unknown) as Application,
        )
        return undefined
      })
  }

  async submitRequestToSyslumenn({
    application,
  }: TemplateApiModuleActionProps): Promise<SubmitRequestToSyslumennResult> {
    const { propertyNumber } = application.answers.selectProperty as {
      propertyNumber: string
    }
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
    const userProfileData = application.externalData.userProfile
      ?.data as UserProfile

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: nationalRegistryData?.nationalId,
      phoneNumber: userProfileData?.mobilePhoneNumber,
      email: userProfileData?.email,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      city: nationalRegistryData?.address.city,
      signed: true,
      type: PersonType.MortgageCertificateApplicant,
    }
    const persons: Person[] = [person]

    const extraData: { [key: string]: string } = {
      propertyNumber: propertyNumber,
    }

    const uploadDataName =
      'Umsókn um lagfæringu á veðbókarvottorði frá Ísland.is'
    const uploadDataId = 'VedbokavottordVilla1.0'

    await this.syslumennService
      .uploadData(persons, undefined, extraData, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennSubmitRequestErrorEmail,
          (application as unknown) as Application,
        )
        return undefined
      })

    return {
      hasSentRequest: true,
    }
  }
}
