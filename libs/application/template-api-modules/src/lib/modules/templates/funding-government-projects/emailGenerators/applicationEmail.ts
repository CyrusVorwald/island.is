import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'

import { getValueViaPath } from '@island.is/application/core'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { FundingAttachment, NodemailAttachment } from '../types'

import { applicationOverviewTemplate } from './applicationOverviewTemplate'

interface ApplicationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    applicationRecipientName: string,
    applicationRecipientEmail: string,
    attachments: FundingAttachment[],
  ): SendMailOptions
}

export const generateApplicationEmail: ApplicationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
  applicationRecipientName,
  applicationRecipientEmail,
  attachments,
): SendMailOptions => {
  const {
    application,
    options: { locale },
  } = props
  const institutionName = getValueViaPath(
    application.answers,
    'organizationOrInstitutionName',
  )

  const subject = `Umsókn frá ${institutionName}`
  const mailAttachments = attachments
    ? attachments.map(
        ({ url, name }) =>
          ({
            filename: name,
            href: url,
          } as NodemailAttachment),
      )
    : []

  const overview = applicationOverviewTemplate(application)
  const body = dedent(`<h2>Yfirlit umsóknar</h2> ${overview}`)

  return {
    from: {
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: [
      {
        name: applicationRecipientName,
        address: applicationRecipientEmail,
      },
    ],
    attachments: mailAttachments,
    subject,
    html: body,
  }
}
