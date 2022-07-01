import {
  buildCustomField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  EQUITIESANDLIABILITIESIDS,
  LESS,
  INDIVIDUALOPERATIONIDS,
} from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const keyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers, externalData) => {
    const lessThanLimit = getValueViaPath(answers, 'election.incomeLimit') !== LESS
    return false
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildCustomField({
          id: 'IndividualIncome',
          title: m.keyNumbersIncomeAndExpenses,
          description: m.fillOutAppopriate,
          component: 'IndividualElectionOperatingIncome',
          childInputIds: Object.values(INDIVIDUALOPERATIONIDS),
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
