import React, { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const NationalIdWithName: FC<FieldBaseProps> = ({
  field,
  application,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue, errors } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')
  const nameField = `${id}.name`
  const nationaIdField = `${id}.nationalId`
  const nameFieldErrors = getErrorViaPath(errors, nameField)
  const nationalIdFieldErrors = getErrorViaPath(errors, nationaIdField)

  const [
    getIdentity,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IdentityQuery, {
    onCompleted: (data) => {
      setValue(nameField, data.identity?.name ?? undefined)
    },
  })

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [nationalIdInput])

  return (
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={nationaIdField}
            label="Kennitala"
            defaultValue={(application.answers[id] as any)?.nationalId ?? ''}
            format="######-####"
            required
            backgroundColor="blue"
            onChange={(v) =>
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
            }
            loading={queryLoading}
            error={nationalIdFieldErrors}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={nameField}
            defaultValue={(application.answers[id] as any)?.name ?? ''}
            label="Nafn"
            error={
              queryError || data?.identity === null
                ? 'Tókst ekki að sækja nafn út frá þessari kennitölu.'
                : nameFieldErrors && !data
                ? nameFieldErrors
                : undefined
            }
            readOnly
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
