import React from 'react'
import { motion } from 'framer-motion'
import { useIntl } from 'react-intl'

import InfoBox from '@island.is/judicial-system-web/src/components/InfoBox/InfoBox'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { Gender, isRestrictionCase } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  withdrawAccusedAppealDate?: () => void
}

const AccusedAppealInfo: React.FC<Props> = (props) => {
  const { workingCase, withdrawAccusedAppealDate } = props
  const { formatMessage } = useIntl()

  const animateInAndOut = {
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
    hidden: { y: 20, opacity: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      key="accusedAppealInfoBox"
      variants={animateInAndOut}
      initial={{ y: 20, opacity: 0 }}
      exit="hidden"
      animate="visible"
    >
      <InfoBox
        text={
          `${capitalize(
            isRestrictionCase(workingCase.type)
              ? formatMessage(core.accused, {
                  suffix:
                    workingCase.defendants &&
                    workingCase.defendants.length > 0 &&
                    workingCase.defendants[0].gender === Gender.MALE
                      ? 'i'
                      : 'a',
                })
              : formatMessage(core.defendant, {
                  suffix:
                    workingCase.defendants && workingCase.defendants?.length > 1
                      ? 'ar'
                      : 'i',
                }),
          )} hefur kært úrskurðinn ${formatDate(
            workingCase.accusedPostponedAppealDate,
            'PPPp',
          )}` || ''
        }
        onDismiss={withdrawAccusedAppealDate}
        fluid
        light
      />
    </motion.div>
  )
}

export default AccusedAppealInfo
