import React from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { ValueLine } from './ValueLine'

export const Overview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao
  console.log({ answers })
  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.nationalId}
              value={formatNationalId(answers.about.nationalId)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine label={m.fullName} value={answers.about.fullName} />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={answers.about.powerOfAttorneyName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={formatNationalId(answers.about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine label={m.email} value={answers.about.email} />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.phoneNumber}
              value={formatPhoneNumber(answers.about.phoneNumber)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={answers.income?.capitalIncome}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.corporateDonation}
              value={answers.income?.corporateDonations}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.individualDonations}
              value={answers.income?.individualDonations}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherIncome}
              value={answers.income?.otherIncome}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.personalDonations}
              value={answers.income?.personalDonations}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.expenses}
              value={answers.expense?.electionOffice}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.travelCost}
              value={answers.expense?.travelCost}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.advertisements}
              value={answers.expense?.advertisements}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalCost}
              value={answers.expense?.capitalCost}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherCost}
              value={answers.expense?.otherCost}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersDebt)}
        </Text>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.currentAssets}
              value={answers.asset?.current}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.tangibleAssets}
              value={answers.asset?.tangible}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.shortTerm}
              value={answers.liability?.shortTerm}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.longTerm}
              value={answers.liability?.longTerm}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.equity}
              value={answers.equity?.totalEquity}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
    </Box>
  )
}
