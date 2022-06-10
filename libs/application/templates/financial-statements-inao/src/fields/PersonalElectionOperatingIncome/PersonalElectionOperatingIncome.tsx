import React, { ReactChild, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField } from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  FinancialStatementsInao,
  FSNFieldBaseProps,
} from '../../lib/utils/dataSchema'
import { OPERATIONIDS } from '../../lib/constants'
import { Income } from './ElectionIncome'
import { Total } from '../KeyNumbers'
import { getTotal } from '../../lib/utils/helpers'

interface PropTypes extends FSNFieldBaseProps {
  field: CustomField
  children: ReactChild
}

export const PersonalElectionOperatingIncome = ({
  application,
  errors,
}: PropTypes): JSX.Element => {
  const { clearErrors, getValues } = useFormContext()
  const [totalIncome, setTotalIncome] = useState(0)
  const { formatMessage } = useLocale()
  const answers = application.answers as FinancialStatementsInao

  const getTotalIncome = (key: string) => {
    const values = getValues()
    const totalIncome: number = getTotal(values, key) 
    setTotalIncome(totalIncome)
    return totalIncome
  }

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <Income getSum={getTotalIncome} />
          <Total total={totalIncome} label={formatMessage(m.totalIncome)} />
        </GridColumn>
        <GridColumn>
          <Text paddingY={1} as="h3" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <InputController
            id={OPERATIONIDS.partyRunning}
            name={OPERATIONIDS.partyRunning}
            backgroundColor="blue"
            label={formatMessage(m.keyNumbersParty)}
            error={errors?.expenses?.partyRunning}
            defaultValue={answers.expenses?.partyRunning}
            onChange={() => {
              clearErrors(OPERATIONIDS.partyRunning)
            }}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
