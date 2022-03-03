import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'

import { shared } from '../../lib/messages'
import Slider from '../components/Slider/Slider'

const minYears = 5
const maxYears = 10

export const YearSlider = ({ field, application }: FieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    5,
  ) as number

  const { clearErrors } = useFormContext()
  const [chosenGivenYears, setChosenGivenYears] = useState<number>(
    currentAnswer,
  )

  return (
    <Box marginBottom={6} marginTop={6}>
      <Text marginBottom={4} variant="h4">
        {formatText(field.title, application, formatMessage)}
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={chosenGivenYears}
          name={id}
          render={({ onChange, value }) => (
            <Slider
              label={{
                singular: formatMessage(shared.yearSingular),
                plural: formatMessage(shared.yearPlural),
              }}
              min={minYears}
              max={maxYears}
              step={1}
              currentIndex={value || chosenGivenYears}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 5 }}
              calculateCellStyle={() => {
                return {
                  background: theme.color.dark200,
                }
              }}
              onChange={(newValue: number) => {
                clearErrors(id)
                onChange(newValue)
                setChosenGivenYears(newValue)
              }}
            />
          )}
        />
      </Box>
    </Box>
  )
}
