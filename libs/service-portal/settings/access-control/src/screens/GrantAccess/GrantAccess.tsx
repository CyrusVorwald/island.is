import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { useForm, Controller, ValidationRules } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'
import { sharedMessages } from '@island.is/shared/translations'

import {
  Box,
  Input,
  Button,
  Icon,
  Text,
  GridRow,
  GridColumn,
  toast,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { Mutation, Query } from '@island.is/api/schema'
import {
  IntroHeader,
  ServicePortalPath,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { AuthDelegationsQuery } from '../AccessControl'
import * as styles from './GrantAccess.css'

const CreateAuthDelegationMutation = gql`
  mutation CreateAuthDelegationMutation($input: CreateAuthDelegationInput!) {
    createAuthDelegation(input: $input) {
      id
      to {
        nationalId
      }
    }
  }
`

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      nationalId
      type
      name
    }
  }
`

const GrantAccess: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings-access-control')

  const noUserFoundToast = () => {
    toast.error(
      formatMessage({
        id: 'sp.settings-access-control:grant-identity-error',
        defaultMessage: 'Enginn notandi fannst með þessa kennitölu.',
      }),
    )
  }

  const [name, setName] = useState('')
  const { handleSubmit, control, errors, watch, reset } = useForm({
    mode: 'onChange',
  })
  const [
    createAuthDelegation,
    { loading: mutationLoading },
  ] = useMutation<Mutation>(CreateAuthDelegationMutation, {
    refetchQueries: [{ query: AuthDelegationsQuery }],
  })
  const [getIdentity, { data, loading: queryLoading }] = useLazyQuery<Query>(
    IdentityQuery,
    {
      onError: noUserFoundToast,
      onCompleted: (data) => {
        if (!data.identity) {
          noUserFoundToast()
        }
      },
    },
  )
  const { identity } = data || {}
  const { formatMessage } = useLocale()
  const history = useHistory()
  const watchToNationalId = watch('toNationalId')
  const loading = queryLoading || mutationLoading

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setName(value)
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    } else {
      setName('')
    }
  }

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setName(identity.name)
    }
  }, [identity, setName, watchToNationalId])

  const onSubmit = handleSubmit(async ({ toNationalId }) => {
    try {
      const { data } = await createAuthDelegation({
        variables: { input: { toNationalId } },
      })
      if (data) {
        history.push(
          `${ServicePortalPath.SettingsAccessControl}/${data.createAuthDelegation.id}`,
        )
      }
    } catch (error) {
      toast.error(
        formatMessage({
          id: 'sp.settings-access-control:grant-create-error',
          defaultMessage:
            'Eitthvað fór úrskeiðis!\nEkki tókst að búa til aðgang fyrir þennan notanda.',
        }),
      )
    }
  })

  const clearForm = () => {
    setName('')
    reset()
  }

  return (
    <Box>
      <IntroHeader
        title={
          userInfo?.profile?.name
            ? formatMessage(
                {
                  id: 'sp.settings-access-control:grant-intro-title-w-name',
                  defaultMessage: '{name} veitir umboð',
                },
                { name: userInfo.profile.name },
              )
            : defineMessage({
                id: 'sp.settings-access-control:grant-intro-title',
                defaultMessage: 'Veita aðgang',
              })
        }
        intro={defineMessage({
          id: 'sp.settings-access-control:grant-intro',
          defaultMessage:
            'Hér getur þú gefið öðrum aðgang til að sýsla með þín gögn hjá island.is',
        })}
      />

      <form onSubmit={onSubmit}>
        <GridRow marginBottom={3}>
          <GridColumn paddingBottom={2} span="12/12">
            <Text variant="h5" as="span">
              {formatMessage({
                id: 'sp.settings-access-control:grant-form-label',
                defaultMessage: 'Sláðu inn upplýsingar aðgangshafa',
              })}
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <div className={styles.inputWrapper}>
              {name && (
                <Input
                  name="name"
                  value={name}
                  aria-live="assertive"
                  label={formatMessage({
                    id: 'sp.settings-access-control:grant-form-access-holder',
                    defaultMessage: 'Aðgangshafi',
                  })}
                  disabled
                  size="md"
                />
              )}
              <Box
                display={name ? 'none' : 'block'}
                aria-live="assertive"
                marginBottom={[1, 1, 0]}
              >
                <InputController
                  control={control}
                  id="toNationalId"
                  defaultValue=""
                  icon={name || queryLoading ? undefined : 'search'}
                  rules={
                    {
                      required: {
                        value: true,
                        message: formatMessage({
                          id: 'sp.settings-access-control:grant-required-ssn',
                          defaultMessage: 'Skylda er að fylla út kennitölu',
                        }),
                      },
                      validate: {
                        value: (value: number) => {
                          if (
                            value.toString().length === 10 &&
                            !kennitala.isValid(value)
                          ) {
                            return formatMessage({
                              id:
                                'sp.settings-access-control:grant-invalid-ssn',
                              defaultMessage:
                                'Kennitalan er ekki gild kennitala',
                            })
                          }
                        },
                      },
                    } as ValidationRules
                  }
                  type="tel"
                  format="######-####"
                  label={formatMessage(sharedMessages.nationalId)}
                  placeholder={'000000-0000'}
                  error={errors.toNationalId?.message}
                  onChange={(value) => {
                    requestDelegation(value)
                  }}
                  size="md"
                />
              </Box>
              {queryLoading ? (
                <span
                  className={cn(styles.icon, styles.loadingIcon)}
                  aria-label="Loading"
                >
                  <Icon icon="reload" size="large" color="blue400" />
                </span>
              ) : name ? (
                <button
                  disabled={loading}
                  onClick={clearForm}
                  className={styles.icon}
                >
                  <Icon icon="close" size="large" color="blue400" />
                </button>
              ) : null}
            </div>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '2/12']}>
            <Button
              size="large"
              fluid
              type="submit"
              icon="arrowForward"
              disabled={!name || loading}
              loading={loading}
            >
              {formatMessage({
                id: 'sp.settings-access-control:grant-form-submit',
                defaultMessage: 'Áfram',
              })}
            </Button>
          </GridColumn>
        </GridRow>
      </form>
    </Box>
  )
}

export default GrantAccess
