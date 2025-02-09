import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { RadioFormField } from '@island.is/application/ui-fields'
import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { maxDaysToGiveOrReceive } from '../../config'
import { YES, NO, TransferRightsOption } from '../../constants'
import { YesOrNo } from '../../types'

const getDefaultValue = (
  isRequestingRights: YesOrNo,
  isGivingRights: YesOrNo,
) => {
  if (isRequestingRights === YES && isGivingRights === YES) {
    return undefined
  }

  if (isRequestingRights === YES) {
    return TransferRightsOption.REQUEST
  }

  if (isGivingRights === YES) {
    return TransferRightsOption.GIVE
  }

  if (isRequestingRights === NO && isGivingRights === NO) {
    return TransferRightsOption.NONE
  }

  return undefined
}

const clampDayValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(min, value), max)
}

interface HiddenValues {
  isRequestingRights: YesOrNo
  requestDays: number
  isGivingRights: YesOrNo
  giveDays: number
}

const calculateHiddenValues = (
  selectedOption: TransferRightsOption | undefined,
  requestDays: number,
  giveDays: number,
): HiddenValues => {
  if (selectedOption === TransferRightsOption.REQUEST) {
    return {
      isRequestingRights: YES,
      requestDays: clampDayValue(requestDays, 1, maxDaysToGiveOrReceive),
      isGivingRights: NO,
      giveDays: 0,
    }
  } else if (selectedOption === TransferRightsOption.GIVE) {
    return {
      isGivingRights: YES,
      giveDays: clampDayValue(giveDays, 1, maxDaysToGiveOrReceive),
      isRequestingRights: NO,
      requestDays: 0,
    }
  }

  return {
    isRequestingRights: NO,
    requestDays: 0,
    isGivingRights: NO,
    giveDays: 0,
  }
}

export const TransferRights: FC<FieldBaseProps & CustomField> = ({
  field,
  application,
  error,
}) => {
  const {
    transferRights,
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
  } = getApplicationAnswers(application.answers)

  const defaultValue =
    transferRights !== undefined
      ? transferRights
      : getDefaultValue(isRequestingRights, isGivingRights)

  const { register } = useFormContext()
  const { formatMessage } = useLocale()
  const [hiddenValues, setHiddenValues] = useState(
    calculateHiddenValues(defaultValue, requestDays, giveDays),
  )

  const onSelect = (selected: string) => {
    const option = selected as TransferRightsOption

    setHiddenValues(calculateHiddenValues(option, requestDays, giveDays))
  }

  return (
    <>
      <RadioFormField
        application={application}
        error={error}
        field={{
          ...field,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          onSelect,
          options: [
            {
              label: formatMessage(
                parentalLeaveFormMessages.shared.transferRightsNone,
              ),
              value: TransferRightsOption.NONE,
            },
            {
              label: formatMessage(
                parentalLeaveFormMessages.shared.transferRightsRequest,
              ),
              value: TransferRightsOption.REQUEST,
            },
            {
              label: formatMessage(
                parentalLeaveFormMessages.shared.transferRightsGive,
              ),
              value: TransferRightsOption.GIVE,
            },
          ],
          backgroundColor: 'blue',
          defaultValue,
        }}
      />
      <input
        type="hidden"
        ref={register}
        name="requestRights.isRequestingRights"
        value={hiddenValues.isRequestingRights}
      />

      <input
        type="hidden"
        ref={register}
        name="requestRights.requestDays"
        value={hiddenValues.requestDays}
      />

      <input
        type="hidden"
        ref={register}
        name="giveRights.isGivingRights"
        value={hiddenValues.isGivingRights}
      />

      <input
        type="hidden"
        ref={register}
        name="giveRights.giveDays"
        value={hiddenValues.giveDays}
      />
    </>
  )
}
