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

import * as styles from './NavigationOverviewScreen.css'

interface Props {
  title: MessageDescriptor
  intro: MessageDescriptor
  navigation?: {
    title: MessageDescriptor
    intro?: MessageDescriptor
    image: string
    link: {
      title: MessageDescriptor
      href: string
    }
  }[]
}

export const NavigationOverviewScreen: FC<Props> = ({
  title,
  intro,
  navigation = [],
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={[4, 6, 9]}>
      <GridRow>
        <GridColumn span={['8/8', '8/8', '6/8']}>
          <Text variant="h3" as="h1" marginBottom={[2, 3]}>
            {formatMessage(title)}
          </Text>
          <Text variant="default" marginBottom={[3, 4, 8]}>
            {formatMessage(intro)}
          </Text>
        </GridColumn>
      </GridRow>
      {navigation.map((nav, index) => (
        <GridRow key={index} alignItems="center" marginBottom={[6, 6, 15]}>
          <GridColumn span={['8/8', '5/8']} order={[2, index % 2 ? 2 : 1]}>
            <Text variant="h4" as="h2" marginBottom={2}>
              {formatMessage(nav.title)}
            </Text>
            <Text marginBottom={[2, 2, 4]}>
              {nav.intro && formatMessage(nav.intro)}
            </Text>
            <Link to={nav.link.href}>
              <ArrowLink>{formatMessage(nav.link.title)}</ArrowLink>
            </Link>
          </GridColumn>
          <GridColumn span={['8/8', '2/8']} order={[1, index % 2 ? 1 : 2]}>
            <Box
              marginTop={[4, 0]}
              marginLeft={[4, 0]}
              className={styles.image}
            >
              <img
                src={nav.image}
                alt={`${formatMessage(m.altText)} ${title}`}
              />
            </Box>
          </GridColumn>
        </GridRow>
      ))}
    </Box>
  )
}
