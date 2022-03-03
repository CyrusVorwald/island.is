import {
  FinanceStatusDetailsChangeItem,
  FinanceStatusDetailsType,
} from '../screens/FinanceStatus/FinanceStatusData.types'

import { gjoldSundurlidunHeaders } from './dataHeaders'
import { downloadFile } from './downloadFile'

export const exportGjoldSundurlidunFile = async (
  data: FinanceStatusDetailsType,
  fileName: string,
  type: 'xlsx' | 'csv',
) => {
  const name = `${fileName}_sundurlidun`
  const dataArray = data.chargeItemSubjects.map(
    (item: FinanceStatusDetailsChangeItem) => [
      item.chargeItemSubject,
      item.timePeriod,
      item.dueDate,
      item.finalDueDate,
      item.principal,
      item.interest,
      item.cost,
      item.paid,
      item.totals,
      fileName,
    ],
  )

  await downloadFile(name, gjoldSundurlidunHeaders, dataArray, type)
}
