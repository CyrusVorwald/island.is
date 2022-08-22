import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  EQUITIESANDLIABILITIESIDS,
  INDIVIDUAL,
  GREATER,
  INDIVIDUALOPERATIONIDS,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const individualKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers, externalData) => {
    const greaterThanLimit =
      getValueViaPath(answers, 'election.incomeLimit') === GREATER
    /* @ts-ignore */
    const userType = externalData?.currentUserType?.data?.code
    return greaterThanLimit && userType === INDIVIDUAL
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildMultiField({
          id: 'operatinCostfields',
          title: m.expensesIncome,
          description: m.fillOutAppopriate,
          children: [
            buildCustomField({
              id: 'IndividualIncome',
              title: '',
              component: 'IndividualElectionOperatingIncome',
              childInputIds: Object.values(INDIVIDUALOPERATIONIDS),
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'keyNumbers.equitiesAndLiabilities',
      title: m.keyNumbersProperty,
      children: [
        buildMultiField({
          id: 'operations.equitiesAndLiabilities',
          title: m.keyNumbersDebt,
          description: m.fillOutAppopriate,
          children: [
            buildCustomField({
              id: 'equitiesAndLiabilities',
              title: m.keyNumbersDebt,
              component: 'ElectionEquities',
              childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
            }),
          ],
        }),
      ],
    }),
  ],
})
