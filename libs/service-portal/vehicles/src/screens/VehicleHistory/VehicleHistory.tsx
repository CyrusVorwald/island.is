import isAfter from 'date-fns/isAfter'
import isEqual from 'lodash/isEqual'
import React, { useState } from 'react'

import { useQuery } from '@apollo/client'
import { Query, VehiclesVehicle } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { messages } from '../../lib/messages'
import { GET_USERS_VEHICLES_HISTORY } from '../../queries/getUsersVehicleHistory'
import TabContent from './TabContent'

const getFilteredVehicles = (
  vehicles: VehiclesVehicle[],
  showDeregistered: boolean,
  fromDate?: Date | null,
  toDate?: Date | null,
): VehiclesVehicle[] => {
  let filteredVehicles = showDeregistered
    ? vehicles
    : vehicles.filter((x) => x.vehicleStatus?.toLowerCase() !== 'afskráð')

  if (fromDate) {
    filteredVehicles = filteredVehicles.filter((x: VehiclesVehicle) => {
      const startDate =
        x.operatorStartDate &&
        new Date(x.operatorStartDate).setHours(0, 0, 0, 0)
      return (
        startDate &&
        (isAfter(startDate, fromDate.getTime()) ||
          isEqual(startDate, fromDate.getTime()))
      )
    })
  }

  if (toDate) {
    filteredVehicles = filteredVehicles.filter((x: VehiclesVehicle) => {
      const endDate =
        x.operatorEndDate && new Date(x.operatorEndDate).setHours(0, 0, 0, 0)
      return (
        endDate &&
        (isAfter(toDate.getTime(), endDate) ||
          isEqual(endDate, toDate.getTime()))
      )
    })
  }

  return filteredVehicles
}

export const VehiclesHistory: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const [checkbox, setCheckbox] = useState(false)
  const [fromDate, setFromDate] = useState<Date | null>()
  const [toDate, setToDate] = useState<Date | null>()

  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLES_HISTORY)
  const vehicles = data?.vehiclesHistoryList?.vehicleList || []
  const filteredVehicles = getFilteredVehicles(
    vehicles,
    checkbox,
    fromDate,
    toDate,
  )
  const filteredOwnersVehicles = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'eigandi',
  )

  const filteredOperatorVehicles = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'umráðamaður',
  )

  const filteredCoOwnerVehicles = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'meðeigandi',
  )

  const tabs = [
    {
      label: formatMessage(messages.ownersHistory),
      content: <TabContent data={filteredOwnersVehicles} />,
    },
    {
      label: formatMessage(messages.coOwnerHistory),
      content: <TabContent data={filteredCoOwnerVehicles} />,
    },
    {
      label: formatMessage(messages.operatorHistory),
      content: <TabContent data={filteredOperatorVehicles} />,
    },
  ]

  return (
    <>
      <IntroHeader
        title={messages.historyTitle}
        intro={messages.historyIntro}
      />

      {error && (
        <Box>
          <EmptyState description={m.errorFetch} />
        </Box>
      )}
      {!loading && !error && vehicles.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
      <Stack space={2}>
        {!loading && !error && vehicles.length > 0 && (
          <GridRow>
            <GridColumn span={['1/1', '8/12', '8/12', '3/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d: Date) => setFromDate(d)}
                icon="calendar"
                iconType="outline"
                size="xs"
                label={formatMessage(messages.dateOfPurchase)}
                selected={fromDate}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '8/12', '8/12', '3/12']}
              offset={['0', '0', '0', '1/12', '0']}
              paddingTop={[2, 2, 2, 0, 0]}
            >
              <DatePicker
                backgroundColor="blue"
                handleChange={(d: Date) => setToDate(d)}
                icon="calendar"
                iconType="outline"
                size="xs"
                label={formatMessage(messages.dateOfSale)}
                selected={toDate}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '8/12', '8/12', '3/12']}
              offset={['0', '0', '0', '1/12', '0']}
              paddingBottom={[2, 2, 2, 0, 0]}
            >
              <Box
                display="flex"
                alignItems="center"
                textAlign="center"
                height="full"
                paddingTop={'p5'}
              >
                <Checkbox
                  label={formatMessage(messages.showDeregistered)}
                  checked={checkbox}
                  onChange={({ target }) => {
                    setCheckbox(target.checked)
                  }}
                />
              </Box>
            </GridColumn>
          </GridRow>
        )}

        {!loading &&
          !error &&
          vehicles.length > 0 &&
          filteredVehicles.length === 0 && (
            <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
              <Text variant="h3" as="h3">
                {formatMessage(messages.noVehiclesFound)}
              </Text>
            </Box>
          )}

        {loading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="full"
            marginTop={6}
          >
            <LoadingDots large />
          </Box>
        )}
        {!loading && !error && filteredVehicles.length > 0 && (
          <Box marginTop={[0, 0, 5]}>
            <Tabs
              label={formatMessage(messages.chooseHistoryType)}
              tabs={tabs}
              contentBackground="transparent"
              selected="0"
              size="xs"
            />
          </Box>
        )}
      </Stack>
    </>
  )
}

export default VehiclesHistory
