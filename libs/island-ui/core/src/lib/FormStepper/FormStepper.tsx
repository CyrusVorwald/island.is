import React, { FC, ReactNode } from 'react'
import cn from 'classnames'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'

import { FormStepperSection } from './FormStepperSection'
import * as types from './types'

import * as styles from './FormStepper.css'

export const FormStepper: FC<{
  theme?: types.FormStepperThemes
  tag?: ReactNode
  formName?: string
  formIcon?: string
  /**
   * Index starts at 0 like array indexes.
   */
  activeSection?: number
  /**
   * Index starts at 0 like array indexes.
   */
  activeSubSection?: number
  sections: types.FormStepperSection[]
  /**
   * If the sub sections passed down have different types, you can define which one to pick and render
   */
  subSection?: string
  showSubSectionIcons?: boolean
}> = ({
  theme = types.FormStepperThemes.PURPLE,
  tag,
  formName,
  formIcon,
  activeSection = 0,
  activeSubSection = 0,
  sections,
  subSection = 'SUB_SECTION',
  showSubSectionIcons = false,
}) => {
  const hasHead = formIcon || formName

  const sectionsWithNames = sections.filter((section) => section?.name !== '')
  const hasSectionsToShow = sectionsWithNames.length > 0

  return (
    <Box paddingTop={[0, 0, 1]} paddingBottom={[1, 1, 0]} width="full">
      {tag && <Box className={styles.tag}>{tag}</Box>}

      {hasHead && (
        <Box alignItems="center" className={styles.head}>
          {formIcon && <img src={formIcon} alt="application-icon" />}

          {formName && (
            <Box marginLeft={formIcon ? 1 : 0}>
              <Text variant="h4">{formName}</Text>
            </Box>
          )}
        </Box>
      )}

      {hasSectionsToShow && (
        <Box
          className={cn(styles.list, {
            [styles.listWithHead]: hasHead,
          })}
        >
          {sectionsWithNames.map((section, index) => {
            return (
              <FormStepperSection
                theme={theme}
                key={`${section.name}-${index}`}
                section={section}
                subSection={subSection}
                isActive={index === activeSection}
                isComplete={index < activeSection}
                isLastSection={index === sections.length - 1}
                sectionIndex={index}
                activeSubSection={activeSubSection}
                showSubSectionIcon={showSubSectionIcons}
              />
            )
          })}
        </Box>
      )}
    </Box>
  )
}
