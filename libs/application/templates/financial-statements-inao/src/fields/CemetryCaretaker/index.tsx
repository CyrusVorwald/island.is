import React, { FC, Fragment, useEffect } from 'react'
import {
  ArrayField,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import {
  Application,
  FormValue,
  RecordObject,
} from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  GridContainer,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getValueViaPath, getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'

export type ComplaineeField = {
  name: string
  nationalId: string
  role: string
}

type Props = {
  id: string
  index: number
  application: Application
  field: Partial<ArrayField<ComplaineeField, 'id'>>
  errors: RecordObject<unknown> | undefined
}

const CareTakerRepeaterItem = ({
  id,
  index,
  application,
  errors,
  field,
}: Props) => {
  const { formatMessage } = useLocale()

  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const roleField = `${fieldIndex}.role`

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingTop={3} paddingRight={2}>
            <InputController
              id={nameField}
              name={nameField}
              label={formatMessage(m.fullName)}
              backgroundColor="blue"
              error={errors && getErrorViaPath(errors, nameField)}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingTop={3} paddingRight={2}>
            <InputController
              id={nationalIdField}
              name={nationalIdField}
              label={formatMessage(m.nationalId)}
              format="######-####"
              backgroundColor="blue"
              error={errors && getErrorViaPath(errors, nationalIdField)}
              defaultValue={
                getValueViaPath(
                  application.answers,
                  nationalIdField,
                  '',
                ) as string
              }
            />
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingTop={2} paddingRight={2}>
            <SelectController
              id={roleField}
              name={roleField}
              label={formatMessage(m.role)}
              placeholder={formatMessage(m.selectRole)}
              backgroundColor="blue"
              error={errors && getErrorViaPath(errors, roleField)}
              options={[
                { label: 'Skoðunarmaður', value: 'Skoðunarmaður' },
                { label: 'Stjórnarmaður', value: 'Stjórnarmaður' },
              ]}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export const CemetryCaretaker: FC<FieldBaseProps<FinancialStatementsInao>> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { id } = field

  const { fields, append, remove } = useFieldArray({
    name: `${id}.caretakers`,
  })

  const handleAddCaretaker = () =>
    append({
      nationalId: '',
      name: '',
      role: '',
    })

  useEffect(() => {
    if (fields.length === 0) handleAddCaretaker()
  }, [fields])

  return (
    <GridContainer>
      {fields.map((field, index) => (
        <Box key={field.id}>
          <CareTakerRepeaterItem
            id={id}
            application={application}
            field={field}
            index={index}
            key={field.id}
            errors={errors}
          />
        </Box>
      ))}
      <GridRow>
        <Box paddingTop={2} paddingLeft="p2">
          <Button
            variant="ghost"
            icon="add"
            iconType="outline"
            size="small"
            onClick={handleAddCaretaker}
          >
            {formatMessage(m.add)}
          </Button>
        </Box>
      </GridRow>
    </GridContainer>
  )
}
