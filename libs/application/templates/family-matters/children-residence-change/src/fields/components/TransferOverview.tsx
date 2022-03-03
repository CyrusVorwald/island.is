import React from 'react'
import { useIntl } from 'react-intl'

import {
  childrenResidenceInfo,
  formatAddress,
  getSelectedChildrenFromExternalData,
  sortChildrenByAge,
} from '@island.is/application/templates/family-matters-core/utils'
import { Box,Text } from '@island.is/island-ui/core'

import { contract } from '../../lib/messages'
import { CRCApplication } from '../../types'

interface Props {
  application: CRCApplication
}

const TransferOverview = ({ application }: Props) => {
  const { formatMessage } = useIntl()
  const { externalData, answers } = application
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    answers.selectedChildren,
  )
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  return (
    <>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.childName, {
            count: children.length,
          })}
        </Text>
        {sortChildrenByAge(children).map((child) => (
          <Text key={child.nationalId}>{child.fullName}</Text>
        ))}
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.currentResidence)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo.current.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo.current.address)}
        </Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.newResidence)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo.future.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo.future.address)}
        </Text>
      </Box>
    </>
  )
}

export default TransferOverview
