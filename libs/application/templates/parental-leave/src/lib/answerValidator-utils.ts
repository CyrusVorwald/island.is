import isWithinInterval from 'date-fns/isWithinInterval'
import parseISO from 'date-fns/parseISO'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'
import subtractDays from 'date-fns/subDays'
import isValid from 'date-fns/isValid'
import { AnswerValidationError, NO_ANSWER } from '@island.is/application/core'
import { Application, StaticTextObject } from '@island.is/application/types'
import { StartDateOptions, YES, NO } from '../constants'
import { getExpectedDateOfBirth } from './parentalLeaveUtils'
import {
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minimumRatio,
  minPeriodDays,
  usageMaxMonths,
  usageMinMonths,
} from '../config'
import { errorMessages } from './messages'

import { Period } from '../types'

const hasBeenAnswered = (answer: unknown) => answer !== undefined

export const dateIsWithinOtherPeriods = (
  date: Date,
  periods: Period[],
  periodIndex?: number,
) => {
  for (const currentPeriod of periods) {
    if (currentPeriod.rawIndex === periodIndex) {
      continue
    }

    if (!currentPeriod.startDate || !currentPeriod.endDate) {
      return false
    }

    const currentPeriodStart = parseISO(currentPeriod.startDate)
    const currentPeriodEnd = parseISO(currentPeriod.endDate)

    const currentPeriodRange = {
      start: currentPeriodStart,
      end: currentPeriodEnd,
    }

    return isWithinInterval(date, currentPeriodRange)
  }

  return false
}

const validFirstPeriodStartValues = [
  StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
  StartDateOptions.ACTUAL_DATE_OF_BIRTH,
  StartDateOptions.SPECIFIC_DATE,
]

export const validatePeriod = (
  period: Period,
  isFirstPeriod: boolean,
  existingPeriods: Period[],
  application: Application,
  buildError: (
    field: string | null,
    message: StaticTextObject,
    values?: Record<string, unknown>,
  ) => AnswerValidationError,
) => {
  const expectedDateOfBirth = getExpectedDateOfBirth(application)

  if (!expectedDateOfBirth) {
    return buildError(null, errorMessages.dateOfBirth)
  }

  const dob = parseISO(expectedDateOfBirth)
  const minimumStartDate = subtractDays(
    dob,
    minimumPeriodStartBeforeExpectedDateOfBirth,
  )

  const maximumStartDate = addMonths(dob, usageMaxMonths - usageMinMonths)
  const maximumEndDate = addMonths(dob, usageMaxMonths)

  const { firstPeriodStart, startDate, useLength, endDate, ratio } = period

  if (isFirstPeriod) {
    if (!firstPeriodStart) {
      return buildError(
        'firstPeriodStart',
        errorMessages.periodsFirstPeriodStartDateDefinitionMissing,
      )
    } else if (
      !validFirstPeriodStartValues.includes(
        firstPeriodStart as StartDateOptions,
      )
    ) {
      return buildError(
        'firstPeriodStart',
        errorMessages.periodsFirstPeriodStartDateDefinitionInvalid,
      )
    }
  }

  let startDateValue: Date | undefined
  if (startDate === NO_ANSWER) {
    return buildError('startDate', errorMessages.periodsStartMissing)
  } else if (hasBeenAnswered(startDate)) {
    if (isFirstPeriod) {
      startDateValue =
        firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH ||
        firstPeriodStart === StartDateOptions.ESTIMATED_DATE_OF_BIRTH
          ? dob
          : parseISO(startDate)
    } else {
      startDateValue = parseISO(startDate)
    }

    if (!isValid(startDateValue)) {
      return buildError('startDate', errorMessages.periodsStartDate)
    }

    if (startDateValue < minimumStartDate) {
      return buildError('startDate', errorMessages.periodsStartDate)
    }

    if (
      dateIsWithinOtherPeriods(startDateValue, existingPeriods, period.rawIndex)
    ) {
      return buildError('startDate', errorMessages.periodsStartDateOverlaps)
    }

    if (startDateValue > maximumStartDate) {
      return buildError('startDate', errorMessages.periodsPeriodRange, {
        usageMaxMonths: usageMaxMonths - usageMinMonths,
      })
    }
  }

  const useLengthIsValid = useLength === YES || useLength === NO

  if (hasBeenAnswered(useLength) && !useLengthIsValid) {
    return buildError(
      'useLength',
      errorMessages.periodsEndDateDefinitionMissing,
    )
  }

  if (hasBeenAnswered(endDate) && !isValid(parseISO(endDate))) {
    return buildError('endDate', errorMessages.periodsEndDateRequired)
  } else if (hasBeenAnswered(endDate)) {
    if (!useLengthIsValid) {
      return buildError(
        'endDate',
        errorMessages.periodsEndDateDefinitionMissing,
      )
    }

    const endDateValue = parseISO(endDate)

    if (
      dateIsWithinOtherPeriods(endDateValue, existingPeriods, period.rawIndex)
    ) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsEndDateOverlapsPeriod,
      )
    }

    if (endDateValue > maximumEndDate) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsPeriodRange,
        {
          usageMaxMonths,
        },
      )
    }

    if (startDateValue === undefined || !isValid(startDateValue)) {
      return buildError('startDate', errorMessages.periodsStartMissing)
    }

    if (endDateValue < startDateValue) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsEndDateBeforeStartDate,
      )
    }

    if (endDateValue < addDays(startDateValue, minPeriodDays - 1)) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsEndDateMinimumPeriod,
        {
          minPeriodDays: minPeriodDays - 1,
        },
      )
    }
  }

  if (hasBeenAnswered(ratio) && ratio === NO_ANSWER) {
    return buildError('ratio', errorMessages.periodsRatioMissing)
  } else if (hasBeenAnswered(ratio)) {
    if (!hasBeenAnswered(startDate)) {
      return buildError('ratio', errorMessages.periodsStartMissing)
    }

    if (!hasBeenAnswered(endDate)) {
      return buildError('ratio', errorMessages.periodsEndDateRequired)
    }

    const ratioValue = Number(ratio)

    if (isNaN(ratioValue)) {
      return buildError('ratio', errorMessages.periodsRatioInvalid)
    }

    if (ratioValue < minimumRatio * 100) {
      return buildError('ratio', errorMessages.periodsRatioBelowMinimum)
    } else if (ratioValue > 100) {
      return buildError('ratio', errorMessages.periodsRatioAboveMaximum)
    }
  }
}
