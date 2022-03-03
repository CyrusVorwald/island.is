import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { m } from '@island.is/service-portal/core'

import { UserDropdownItem } from './UserDropdownItem'

export const UserProfileInfo = ({ onClick }: { onClick: () => void }) => {
  const { formatMessage } = useLocale()
  const origin = window.location.origin
  const baseUrl = `${origin}/minarsidur/stillingar`

  const { value: showPersonalInfo } = useFeatureFlag(
    Features.personalInformation,
    false,
  )

  const { value: showDelegations } = useFeatureFlag(
    Features.delegationsEnabled,
    false,
  )

  return (
    <Box paddingY={[1, 3]}>
      <Box marginBottom={1}>
        <Text variant="small">{formatMessage(m.settings)}</Text>
      </Box>

      {showPersonalInfo && (
        <Box>
          <UserDropdownItem
            text={formatMessage(m.personalInformation)}
            link={`${baseUrl}/minar-stillingar`}
            icon={{ type: 'outline', icon: 'person' }}
            onClick={() => onClick()}
          />
        </Box>
      )}
      {showDelegations && (
        <Box>
          <UserDropdownItem
            text={formatMessage(m.accessControl)}
            link={`${baseUrl}/adgangsstyring`}
            icon={{ type: 'outline', icon: 'people' }}
            onClick={() => onClick()}
          />
        </Box>
      )}
    </Box>
  )
}
