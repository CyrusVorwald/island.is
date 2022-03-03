import React, { FC, useState } from 'react'

import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
  ValidAnswers,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'

import { defaultMonths } from '../../config'
import { NO,YES } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import BoxChart, { BoxChartKey } from '../components/BoxChart'

const GiveRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const { formatMessage } = useLocale()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const boxChartKeys = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
  ]

  return (
    <Box marginTop={3} marginBottom={2} key={field.id}>
      <Box paddingY={3}>
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              label: formatText(
                parentalLeaveFormMessages.shared.giveRightsYes,
                application,
                formatMessage,
              ),
              value: YES,
            },
            {
              label: formatText(
                parentalLeaveFormMessages.shared.giveRightsNo,
                application,
                formatMessage,
              ),
              value: NO,
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
      </Box>

      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">
            {formatMessage(parentalLeaveFormMessages.errors.requiredAnswer)}
          </Text>
        </Box>
      )}

      {statefulAnswer === NO && (
        <BoxChart
          application={application}
          boxes={defaultMonths}
          calculateBoxStyle={() => {
            return 'blue'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      )}
    </Box>
  )
}

export default GiveRights
