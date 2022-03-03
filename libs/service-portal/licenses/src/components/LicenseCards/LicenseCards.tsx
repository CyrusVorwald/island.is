import React, { FC } from 'react'

import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { DrivingLicenseType } from '@island.is/service-portal/core'

import { DrivingLicense } from '../DrivingLicense/DrivingLicense'
interface Props {
  data: DrivingLicenseType
}

const LicenseCards: FC<Props> = ({ data }) => {
  useNamespaces('sp.driving-license')

  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          <DrivingLicense
            id={data.id.toString()}
            expireDate={data.gildirTil.toString()}
          />
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards
