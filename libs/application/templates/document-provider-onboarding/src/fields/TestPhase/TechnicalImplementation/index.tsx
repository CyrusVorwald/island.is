import React, { FC } from 'react'
import { getValueViaPath, formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../../forms/messages'
import { useFormContext, Controller } from 'react-hook-form'
import { Box, Text, Checkbox } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

const TestPhaseInfoScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers: formValue } = application

  const currentAnswer = getValueViaPath(
    formValue,
    'technicalAnswer' as string,
    false,
  ) as boolean
  const { setValue, errors, getValues } = useFormContext()

  return (
    <Box>
      <Box marginBottom={3}>
        <Text>
          <strong>
            {formatText(
              m.testTechnicalImplementationSubTitle,
              application,
              formatMessage,
            )}
          </strong>
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text>
          {formatText(
            m.testTechnicalImplementationMessage1,
            application,
            formatMessage,
          )}
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text>
          {formatText(
            m.testTechnicalImplementationMessage2,
            application,
            formatMessage,
          )}
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Controller
          name="technicalAnswer"
          defaultValue={currentAnswer}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue('technicalAnswer' as string, e.target.checked)
                }}
                checked={value}
                name="technicalAnswer"
                label={formatText(
                  m.technicalImplementationOptionLabel,
                  application,
                  formatMessage,
                )}
                large
                hasError={
                  errors.technicalAnswer &&
                  getValues('technicalAnswer') === false
                }
                errorMessage={errors.technicalAnswer}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default TestPhaseInfoScreen
