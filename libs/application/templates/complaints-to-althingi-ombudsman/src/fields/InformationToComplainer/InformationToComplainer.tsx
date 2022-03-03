import React, { FC } from 'react'

import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Bullet, BulletList } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { informationToComplainer } from '../../lib/messages'

export const InformationToComplainer: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
        <BulletList type="ul">
          <Bullet>
            {formatText(
              informationToComplainer.general.bulletOne,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              informationToComplainer.general.bulletTwo,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              informationToComplainer.general.bulletThree,
              application,
              formatMessage,
            )}
          </Bullet>
        </BulletList>
      </Box>
  )
}
