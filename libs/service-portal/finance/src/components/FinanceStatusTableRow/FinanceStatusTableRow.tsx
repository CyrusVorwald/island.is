import React, { FC } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { User } from 'oidc-client'

import { ExpandRow } from '../../components/ExpandableTable'
import FinanceStatusDetailTable from '../../components/FinanceStatusDetailTable/FinanceStatusDetailTable'
import {
  FinanceStatusDetailsType,
  FinanceStatusOrganizationChargeType,
  FinanceStatusOrganizationType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import amountFormat from '../../utils/amountFormat'

const GetFinanceStatusDetailsQuery = gql`
  query GetFinanceStatusDetailsQuery($input: GetFinancialOverviewInput!) {
    getFinanceStatusDetails(input: $input)
  }
`

interface Props {
  organization: FinanceStatusOrganizationType
  chargeType: FinanceStatusOrganizationChargeType
  downloadURL: string
  userInfo: User
}

const FinanceStatusTableRow: FC<Props> = ({
  organization,
  chargeType,
  downloadURL,
  userInfo,
}) => {
  const [getDetailsQuery, { loading, error, ...detailsQuery }] = useLazyQuery(
    GetFinanceStatusDetailsQuery,
  )
  const financeStatusDetails: FinanceStatusDetailsType =
    detailsQuery.data?.getFinanceStatusDetails || {}

  return (
    <ExpandRow
      key={chargeType.id}
      onExpandCallback={() =>
        getDetailsQuery({
          variables: {
            input: {
              orgID: organization.id,
              chargeTypeID: chargeType.id,
            },
          },
        })
      }
      data={[
        { value: chargeType.name },
        { value: organization.name },
        { value: amountFormat(chargeType.totals), align: 'right' },
      ]}
      loading={loading}
      error={error}
    >
      {financeStatusDetails?.chargeItemSubjects?.length > 0 ? (
        <FinanceStatusDetailTable
          organization={organization}
          financeStatusDetails={financeStatusDetails}
          downloadURL={downloadURL}
          userInfo={userInfo}
        />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceStatusTableRow
