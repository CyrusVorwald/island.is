import React from 'react'
import { useIntl } from 'react-intl'

import { PdfTypes } from '@island.is/application/core'
import {
  BorderedAccordion,
  DescriptionText,
  PdfLink,
} from '@island.is/application/templates/family-matters-core/components'
import { useGeneratePdfUrl } from '@island.is/application/templates/family-matters-core/hooks'
import { Box, Text } from '@island.is/island-ui/core'

import { CRCFieldBaseProps } from '../..'
import { Roles } from '../../lib/constants'
import { contract,parentBConfirmation } from '../../lib/messages'
import { ContractOverview } from '../components'

import { confirmationIllustration } from '../Shared.css'

const ParentBConfirmation = ({ application }: CRCFieldBaseProps) => {
  const pdfType = PdfTypes.CHILDREN_RESIDENCE_CHANGE
  const { pdfUrl } = useGeneratePdfUrl(application.id, pdfType)
  const { formatMessage } = useIntl()

  return (
    <Box marginTop={3} paddingBottom={5}>
      <DescriptionText text={parentBConfirmation.general.description} />
      <Text variant="h4" marginTop={3}>
        {formatMessage(parentBConfirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={parentBConfirmation.nextSteps.description} />
      </Box>
      <Box marginTop={5}>
        <Box marginBottom={3}>
          <PdfLink
            url={pdfUrl}
            label={formatMessage(contract.pdfButton.label)}
          />
        </Box>
        <BorderedAccordion
          title={formatMessage(
            parentBConfirmation.contractOverview.accordionTitle,
          )}
          id="id_1"
        >
          <ContractOverview
            application={application}
            parentKey={Roles.ParentB}
          />
        </BorderedAccordion>
      </Box>
      <Box className={confirmationIllustration}>
        <img
          src={
            'https://images.ctfassets.net/8k0h54kbe6bj/6UGl8bkfOwUDKYveXfKkh0/c09265b9301b0be52c678a7197a64154/crc-application-submitted.svg'
          }
          alt=""
        />
      </Box>
    </Box>
  )
}

export default ParentBConfirmation
