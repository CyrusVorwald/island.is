import React, { FC, useCallback,useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import * as Sentry from '@sentry/react'
import format from 'date-fns/format'

import {
  extractRepeaterIndexFromField,
  FieldBaseProps,
  NO_ANSWER,
  RecordObject,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import { usageMaxMonths, usageMinMonths } from '../../config'
import { DATE_FORMAT,StartDateOptions } from '../../constants'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'
import {
  calculateEndDateForPeriodWithStartAndLength,
  calculatePeriodLengthInMonths,
  getApplicationAnswers,
} from '../../lib/parentalLeaveUtils'
import Slider from '../components/Slider'

import * as styles from './Duration.css'

const DEFAULT_PERIOD_LENGTH = usageMinMonths

export const Duration: FC<FieldBaseProps> = ({
  field,
  application,
  errors,
}) => {
  const { id } = field
  const { register, setError, clearErrors } = useFormContext()
  const { formatMessage, formatDateFns } = useLocale()
  const { answers } = application
  const { rawPeriods } = getApplicationAnswers(answers)
  const currentIndex = extractRepeaterIndexFromField(field)
  const currentPeriod = rawPeriods[currentIndex]
  const currentStartDateAnswer = currentPeriod.startDate

  const [chosenEndDate, setChosenEndDate] = useState<string | undefined>(
    currentPeriod.endDate ?? NO_ANSWER,
  )
  const [chosenDuration, setChosenDuration] = useState<number>(
    currentPeriod.endDate
      ? calculatePeriodLengthInMonths(
          currentPeriod.startDate,
          currentPeriod.endDate,
        )
      : DEFAULT_PERIOD_LENGTH,
  )
  const errorMessage =
    (errors?.component as RecordObject<string>)?.message ||
    (errors as RecordObject<string>)?.[id]

  const monthsToEndDate = useCallback(
    (lengthInMonths: number) => {
      try {
        const calculatedEndDate = calculateEndDateForPeriodWithStartAndLength(
          currentStartDateAnswer,
          lengthInMonths,
        )

        setChosenEndDate(calculatedEndDate.toISOString())

        return calculatedEndDate
      } catch (e) {
        Sentry.captureException((e as Error).message)

        setError('component', {
          type: 'error',
          message: formatMessage(errorMessages.durationPeriods),
        })
      }
    },
    [currentStartDateAnswer, formatMessage, setError],
  )

  const handleChange = async (months: number) => {
    clearErrors([id, 'component'])
    setChosenDuration(months)
  }

  const handleChangeEnd = async (
    months: number,
    onChange: (...event: any[]) => void,
  ) => {
    const date = await monthsToEndDate(months)

    if (date) {
      onChange(format(date, DATE_FORMAT))
    }
  }

  useEffect(() => {
    const init = async () => {
      await monthsToEndDate(DEFAULT_PERIOD_LENGTH)
    }

    init()
  }, [])

  const rangeDates =
    currentPeriod.firstPeriodStart !== StartDateOptions.ACTUAL_DATE_OF_BIRTH
      ? {
          start: {
            date: formatDateFns(currentStartDateAnswer),
            message: formatMessage(
              parentalLeaveFormMessages.shared.rangeStartDate,
            ),
          },
          end: {
            date: chosenEndDate ? formatDateFns(chosenEndDate) : '—',
            message: formatMessage(
              parentalLeaveFormMessages.shared.rangeEndDate,
            ),
          },
        }
      : undefined

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.duration.monthsDescription,
        )}
      />

      <Box
        background="blue100"
        paddingTop={6}
        paddingBottom={4}
        paddingX={3}
        marginTop={3}
      >
        {chosenEndDate ? (
          <Controller
            defaultValue={chosenEndDate}
            name={id}
            render={({ onChange }) => (
              <Slider
                min={usageMinMonths}
                max={usageMaxMonths}
                trackStyle={{ gridTemplateRows: 8 }}
                calculateCellStyle={() => ({
                  background: theme.color.dark200,
                })}
                showMinMaxLabels
                showToolTip
                label={{
                  singular: formatMessage(
                    parentalLeaveFormMessages.shared.month,
                  ),
                  plural: formatMessage(
                    parentalLeaveFormMessages.shared.months,
                  ),
                }}
                rangeDates={rangeDates}
                currentIndex={chosenDuration}
                onChange={(months: number) => handleChange(months)}
                onChangeEnd={(months: number) =>
                  handleChangeEnd(months, onChange)
                }
              />
            )}
          />
        ) : (
          'Sæki gögn...'
        )}
      </Box>

      {errorMessage && (
        <Box
          paddingTop={2}
          className={styles.errorMessage}
          aria-live="assertive"
        >
          {errorMessage}
        </Box>
      )}

      <input
        readOnly
        ref={register}
        type="hidden"
        value={chosenEndDate}
        name={`periods[${currentIndex}].endDate`}
      />
    </Box>
  )
}
