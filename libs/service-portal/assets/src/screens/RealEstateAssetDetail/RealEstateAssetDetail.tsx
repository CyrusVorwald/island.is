import React from 'react'
import { useParams } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import { useQuery, useLazyQuery } from '@apollo/client'
import { Query, PropertyOwner } from '@island.is/api/schema'
import { useNamespaces, useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  NotFound,
  amountFormat,
} from '@island.is/service-portal/core'
import AssetGrid from '../../components/AssetGrid'
import AssetLoader from '../../components/AssetLoader'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import { ownersArray } from '../../utils/createUnits'
import { messages } from '../../lib/messages'
import {
  GET_SINGLE_PROPERTY_QUERY,
  GET_PROPERTY_OWNERS_QUERY,
} from '../../lib/queries'
import DetailHeader from '../../components/DetailHeader'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'
import { TableGrid, TableUnits } from '@island.is/service-portal/core'

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()
  const { id }: { id: string | undefined } = useParams()

  const { loading, error, data } = useQuery<Query>(GET_SINGLE_PROPERTY_QUERY, {
    variables: {
      input: {
        assetId: id,
      },
    },
  })
  const assetData = data?.assetsDetail || {}

  const [
    getOwnersQuery,
    { loading: ownerLoading, error: ownerError, fetchMore, ...ownersQuery },
  ] = useLazyQuery(GET_PROPERTY_OWNERS_QUERY)
  const eigendurPaginationData: PropertyOwner[] =
    ownersQuery?.data?.assetsPropertyOwners?.registeredOwners || []

  const assetOwners = assetData.registeredOwners?.registeredOwners || []

  const combinedOwnerArray = [...assetOwners, ...eigendurPaginationData]

  const owners = ownersArray(combinedOwnerArray)

  const paginate = () => {
    const variableObject = {
      variables: {
        input: {
          assetId: assetData?.propertyNumber,
          cursor: Math.ceil(
            eigendurPaginationData.length / DEFAULT_PAGING_ITEMS + 1,
          ).toString(),
        },
      },
    }

    if (fetchMore) {
      fetchMore({
        ...variableObject,
        updateQuery: (prevResult, { fetchMoreResult }) => {
          fetchMoreResult.assetsPropertyOwners.thinglystirEigendur = [
            ...prevResult.assetsPropertyOwners.thinglystirEigendur,
            ...fetchMoreResult.assetsPropertyOwners.thinglystirEigendur,
          ]
          return fetchMoreResult
        },
      })
    } else {
      getOwnersQuery(variableObject)
    }
  }

  if (loading) {
    return <AssetLoader />
  }

  if (!id || error || (!loading && data?.assetsDetail === null)) {
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.assets:not-found',
          defaultMessage: 'Fasteign fannst ekki',
        })}
      />
    )
  }

  const paginateOwners =
    ownersQuery?.data?.assetsPropertyOwners.paging?.hasNextPage ||
    (assetData.registeredOwners?.paging?.hasNextPage &&
      !ownersQuery?.data?.assetsPropertyOwners?.paging)

  return (
    <>
      <DetailHeader
        title={`${assetData?.defaultAddress?.displayShort} - ${assetData?.propertyNumber}`}
      />
      <Box>
        <TableUnits
          paginateCallback={() => paginate()}
          tables={[
            {
              header: [
                formatMessage(messages.legalOwners),
                formatMessage(messages.ssn),
                formatMessage(messages.authorization),
                formatMessage(messages.holdings),
                formatMessage(messages.purchaseDate),
              ],
              rows: owners,
              paginate: paginateOwners,
            },
            {
              header: [
                `${formatMessage(messages.appraisal)} ${
                  assetData.appraisal?.activeYear
                }`,
                `${formatMessage(messages.appraisal)} ${
                  assetData.appraisal?.plannedYear
                }`,
              ],
              rows: [
                [
                  assetData.appraisal?.activeAppraisal
                    ? amountFormat(assetData.appraisal?.activeAppraisal)
                    : '',
                  assetData.appraisal?.plannedAppraisal
                    ? amountFormat(assetData.appraisal?.plannedAppraisal)
                    : '',
                ],
              ],
            },
          ]}
        />
      </Box>
      {assetData.land?.landNumber ? (
        <TableGrid
          title={formatMessage(messages.land)}
          mt
          dataArray={[
            [
              {
                title: formatMessage(messages.usage),
                value: assetData.land?.useDisplay ?? '',
              },
              {
                title: formatMessage(messages.landSize),
                value: assetData.land?.area
                  ? `${assetData.land?.area} ${assetData.land?.areaUnit}`
                  : '',
              },
            ],
            [
              {
                title: formatMessage(messages.landNumber),
                value: assetData.land?.landNumber,
              },
              {
                title: formatMessage(messages.landAppraisal),
                value: assetData.land?.landAppraisal
                  ? amountFormat(assetData.land?.landAppraisal)
                  : '',
              },
            ],
          ]}
        />
      ) : null}
      <Box marginTop={7}>
        {assetData?.unitsOfUse?.unitsOfUse &&
        assetData?.unitsOfUse?.unitsOfUse?.length > 0 ? (
          <AssetGrid
            title={formatMessage(messages.unitsOfUse)}
            locationData={assetData?.defaultAddress}
            units={assetData?.unitsOfUse}
            assetId={assetData?.propertyNumber}
          />
        ) : null}
      </Box>
      <Box marginTop={8}>
        <AssetDisclaimer />
      </Box>
    </>
  )
}

export default AssetsOverview
