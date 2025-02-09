import React from 'react'
import { useIntl } from 'react-intl'

import { Case, isInvestigationCase } from '@island.is/judicial-system/types'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { Box, Text, FocusableBox, Tag } from '@island.is/island-ui/core'

import * as styles from './MobileCase.css'
import { displayCaseType, mapCaseStateToTagVariant } from './utils'

interface CategoryCardProps {
  heading: string | React.ReactNode
  tags?: React.ReactNode
  onClick: () => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  heading,
  onClick,
  tags,
  children,
}) => {
  return (
    <FocusableBox
      className={styles.card}
      height="full"
      width="full"
      component="button"
      onClick={onClick}
    >
      <Box>
        <Text variant="h3" as="h3" color={'blue400'} marginBottom={1}>
          {heading}
        </Text>
        {children}
        <Box marginTop={3}>{tags}</Box>
      </Box>
    </FocusableBox>
  )
}

interface Props {
  theCase: Case
  onClick: () => void
  isCourtRole: boolean
}

const MobileCase: React.FC<Props> = ({
  theCase,
  onClick,
  isCourtRole,
  children,
}) => {
  const { formatMessage } = useIntl()
  const tag = mapCaseStateToTagVariant(
    formatMessage,
    theCase.state,
    isCourtRole,
    isInvestigationCase(theCase.type),
    theCase.isValidToDateInThePast,
    theCase.courtDate,
  )
  return (
    <CategoryCard
      heading={displayCaseType(formatMessage, theCase.type, theCase.decision)}
      onClick={onClick}
      tags={[
        <Tag variant={tag.color} outlined disabled key={tag.text}>
          {tag.text}
        </Tag>,
      ]}
    >
      <Text>{theCase.policeCaseNumbers.join(', ')}</Text>
      {theCase.courtCaseNumber && <Text>{theCase.courtCaseNumber}</Text>}
      <br />
      {theCase.defendants && theCase.defendants.length > 0 && (
        <>
          <Text>{theCase.defendants[0].name ?? ''}</Text>
          {theCase.defendants.length === 1 ? (
            <Text>
              <Text>
                {formatDOB(
                  theCase.defendants[0].nationalId,
                  theCase.defendants[0].noNationalId,
                )}
              </Text>
            </Text>
          ) : (
            <Text>{`+ ${theCase.defendants.length - 1}`}</Text>
          )}
        </>
      )}
      <Box marginTop={1}>{children}</Box>
    </CategoryCard>
  )
}

export default MobileCase
