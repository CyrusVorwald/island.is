import {
  buildCustomField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  GREATER,
  OPERATIONIDS,
  EQUITIESANDLIABILITIESIDS,
} from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const keyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers) => {
    return getValueViaPath(answers, 'election.incomeLimit') === GREATER
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildCustomField({
          id: 'income',
          title: m.keyNumbersIncomeAndExpenses,
          description: m.fillOutAppopriate,
          component: 'IndividualElectionOperatingIncome',
          childInputIds: Object.values(OPERATIONIDS),
        }),
      ],
    }),
    buildSubSection({
      id: 'keyNumbers.equitiesAndLiabilities',
      title: m.keyNumbersProperty,
      children: [
        buildCustomField({
          id: 'equitiesAndLiabilities',
          title: m.keyNumbersDebt,
          description: m.fillOutAppopriate,
          component: 'IndividualElectionEquities',
          childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
        }),
      ],
    }),
  ],
})
