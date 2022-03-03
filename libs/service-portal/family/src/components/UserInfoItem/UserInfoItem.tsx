import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Link } from 'react-router-dom'

import {
  ArrowLink,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

interface UserInfoOverviewItemComponent {
  heading: MessageDescriptor | string
  subtext: MessageDescriptor | string
  link: string
  image: string
}

const UserInfoOverviewItem: FC<UserInfoOverviewItemComponent> = ({
  heading,
  subtext,
  link,
  image,
}) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '5/8']} order={[2, 2, 1]}>
        <Box
          display="flex"
          flexDirection="column"
          height="full"
          justifyContent="center"
          marginTop={[3, 3, 0]}
        >
          <Box marginBottom={2}>
            <Text variant="h2" as="h2">
              {formatMessage(heading)}
            </Text>
          </Box>
          <Text marginBottom={[3, 4]}>{formatMessage(subtext)}</Text>
          <Box>
            <Link to={link}>
              <ArrowLink>{formatMessage(m.continue)}</ArrowLink>
            </Link>
          </Box>
        </Box>
      </GridColumn>
      <GridColumn span={['1/1', '1/1', '3/8']} order={[1, 1, 2]}>
        <Box
          display="flex"
          height="full"
          justifyContent="center"
          alignItems="center"
          marginBottom={[3, 3, 0]}
        >
          <img src={image} alt={`${formatMessage(m.altText)} ${heading}`} />
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default UserInfoOverviewItem
