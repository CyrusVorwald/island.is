import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import {
  Box,
  Bullet,
  BulletList,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'

import { m } from '../../forms/messages'
import { NO, YES } from '../../shared'
import { AdditionalInfoType, ReviewFieldProps } from '../../types'

interface Props extends ReviewFieldProps {
  additionalInfo: AdditionalInfoType
}

const ReviewMissingInfo: FC<Props> = ({
  application,
  isEditable,
  additionalInfo = {},
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={2}>
      <Stack space={3}>
        <Box>
          <FieldDescription
            description={formatText(
              m.additionalInfo,
              application,
              formatMessage,
            )}
          />
          <RadioController
            id={'additionalInfo.hasAdditionalInfo'}
            name={'additionalInfo.hasAdditionalInfo'}
            disabled={!isEditable}
            largeButtons={true}
            split={'1/2'}
            options={[
              {
                label: formatText(m.noOptionLabel, application, formatMessage),
                value: NO,
              },
              {
                label: formatText(m.yesOptionLabel, application, formatMessage),
                value: YES,
              },
            ]}
          />
          <Input
            id={'additionalInfo.remarks'}
            name={'additionalInfo.remarks'}
            label={formatText(m.additionalRemarks, application, formatMessage)}
            defaultValue={additionalInfo.remarks}
            placeholder={formatText(
              m.additionalRemarksPlaceholder,
              application,
              formatMessage,
            )}
            disabled={!isEditable}
            textarea
          />
        </Box>
        {additionalInfo.files && additionalInfo.files?.length > 0 && (
          <Stack space={1}>
            <Text variant="h5">
              {formatText(m.attachedFilesTitle, application, formatMessage)}
            </Text>
            <BulletList type={'ul'}>
              {additionalInfo.files.map((file: string, fileIndex: number) => (
                <Bullet key={`additionalInfo_file${fileIndex}`}>{file}</Bullet>
              ))}
            </BulletList>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default ReviewMissingInfo
