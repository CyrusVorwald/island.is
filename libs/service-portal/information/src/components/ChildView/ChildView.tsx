import React, { FC } from 'react'
import { defineMessage } from 'react-intl'
import { NationalRegistryChild } from '@island.is/api/schema'
import { ApolloError } from 'apollo-client'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  UserInfoLine,
  m,
  IntroHeader,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { TwoColumnUserInfoLine } from '../TwoColumnUserInfoLine/TwoColumnUserInfoLine'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const editLink = defineMessage({
  id: 'sp.family:edit-link',
  defaultMessage: 'Breyta hjá Þjóðskrá',
})

interface Props {
  nationalId?: string
  error?: ApolloError
  person?: NationalRegistryChild | null
  loading?: boolean
  isChild?: boolean
  hasDetails?: boolean
}

const ChildView: FC<Props> = ({
  nationalId,
  error,
  loading,
  person,
  isChild,
  hasDetails,
}) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )
  return (
    <>
      {loading ? (
        <Box marginBottom={6}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <LoadingDots />
            </GridColumn>
          </GridRow>
        </Box>
      ) : (
        <IntroHeader
          title={person?.fullName ?? ''}
          intro={{
            id: 'sp.family:data-info-child',
            defaultMessage:
              'Hér fyrir neðan eru gögn um fjölskyldumeðlim. Þú hefur kost á að gera breytingar á eftirfarandi upplýsingum ef þú kýst.',
          }}
        />
      )}

      <Box>
        <GridRow>
          <GridColumn paddingBottom={4} span="12/12">
            <Box
              display="flex"
              justifyContent="flexStart"
              flexDirection={['column', 'row']}
            >
              <Box>
                <Button
                  variant="utility"
                  size="small"
                  onClick={() => console.log('pdf!')}
                  icon="receipt"
                  iconType="outline"
                >
                  PDF
                </Button>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={formatMessage(m.fullName)}
          content={person?.fullName || '...'}
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url:
                    'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
                }
              : undefined
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.legalResidence)}
          content={person?.legalResidence || ''}
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url: 'https://skra.is/folk/flutningur/flutningur-barna/',
                }
              : undefined
          }
        />
        <Divider />
        <Box marginY={3} />

        <UserInfoLine
          title={formatMessage(m.baseInfo)}
          label={formatMessage({
            id: 'sp.family:birthplace',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.birthplace || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.religion)}
          content={
            error ? formatMessage(dataNotFoundMessage) : person?.religion || ''
          }
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url:
                    'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
                }
              : undefined
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.gender)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.genderDisplay || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.citizenship)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.nationality || ''
          }
          loading={loading}
        />
        <Divider />
        {person?.fate && (
          <>
            <UserInfoLine
              label={formatMessage({
                id: 'sp.family:fate',
                defaultMessage: 'Afdrif',
              })}
              content={
                error ? formatMessage(dataNotFoundMessage) : person?.fate || ''
              }
              loading={loading}
            />
            <Divider />
          </>
        )}
        <Box marginY={3} />
        {(person?.parent1 || person?.parent2 || loading) && (
          <>
            <TwoColumnUserInfoLine
              title={formatMessage({
                id: 'sp.family:TwoColumnUserInfoLine',
                defaultMessage: 'Foreldrar',
              })}
              label={formatMessage({
                id: 'sp.family:name',
                defaultMessage: 'Nafn',
              })}
              firstValue={person?.nameParent1}
              secondValue={person?.nameParent2}
              loading={loading}
            />
            <Divider />
            <TwoColumnUserInfoLine
              label={formatMessage(m.natreg)}
              firstValue={
                person?.parent1 ? formatNationalId(person.parent1) : ''
              }
              secondValue={
                person?.parent2 ? formatNationalId(person.parent2) : ''
              }
              loading={loading}
            />
            <Divider />
          </>
        )}
        <Box marginY={3} />
        {!person?.fate && !error && hasDetails ? (
          <>
            <UserInfoLine
              title={formatMessage({
                id: 'sp.family:custody-TwoColumnUserInfoLine',
                defaultMessage: 'Forsjáraðilar',
              })}
              label={formatMessage({
                id: 'sp.family:child-name',
                defaultMessage: 'Nafn barns',
              })}
              content={person?.fullName}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage({
                id: 'sp.family:child-ssn',
                defaultMessage: 'Kennitala barns',
              })}
              content={person?.nationalId}
              loading={loading}
            />
            <Divider />
            <TwoColumnUserInfoLine
              label={formatMessage({
                id: 'sp.family:name',
                defaultMessage: 'Nafn',
              })}
              firstValue={person?.nameCustody1}
              secondValue={person?.nameCustody2}
              loading={loading}
            />
            <Divider />
            <TwoColumnUserInfoLine
              label={formatMessage(m.natreg)}
              firstValue={
                person?.custody1 ? formatNationalId(person.custody1) : ''
              }
              secondValue={
                person?.custody2 ? formatNationalId(person.custody2) : ''
              }
              loading={loading}
            />
            <Divider />
            <TwoColumnUserInfoLine
              label={formatMessage({
                id: 'sp.family:custody-status',
                defaultMessage: 'Staða forsjár',
              })}
              firstValue={person?.custodyText1}
              secondValue={person?.custodyText2}
              loading={loading}
            />
            <Divider />
            <TwoColumnUserInfoLine
              label={formatMessage({
                id: 'sp.family:legal-residence-parent',
                defaultMessage: 'Lögheimilsforeldri',
              })}
              firstValue={'TODO'}
              secondValue={'TODO'}
              loading={loading}
            />
            <Divider />
            <TwoColumnUserInfoLine
              label={formatMessage({
                id: 'sp.family:place-of-residence-parent',
                defaultMessage: 'Búsetuforeldri',
              })}
              firstValue={'TODO'}
              secondValue={'TODO'}
              loading={loading}
            />
            <Divider />
          </>
        ) : null}
      </Stack>
    </>
  )
}
export default ChildView
