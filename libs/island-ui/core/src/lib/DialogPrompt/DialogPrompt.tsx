import React, { ReactElement } from 'react'

import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { Icon } from '../IconRC/Icon'
import { ModalBase } from '../ModalBase/ModalBase'
import { Text } from '../Text/Text'

import * as styles from './DialogPrompt.css'

interface DialogPromptProps {
  /**
   * The heading text content
   */
  title: string
  /**
   * The paragraph text content
   */
  description?: string
  /**
   * Explain what this modal is for
   */
  ariaLabel: string
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  /**
   * Element that opens the dialog.
   * It will be forwarded neccessery props for a11y and event handling.
   */
  disclosureElement: ReactElement
  /**
   * User presses confirm callback
   */
  onConfirm?: () => void
  /**
   * User presses cancel callback
   */
  onCancel?: () => void
  /**
   * Show immediately without clicking the disclosure button
   */
  initialVisibility?: boolean | undefined
  /**
   * If left empty the button won't be rendered
   */
  buttonTextConfirm?: string
  /**
   * If left empty the button won't be rendered
   */
  buttonTextCancel?: string
}

export const DialogPrompt = ({
  title,
  description,
  ariaLabel,
  baseId,
  disclosureElement,
  onConfirm,
  onCancel,
  buttonTextCancel,
  buttonTextConfirm,
  initialVisibility,
}: DialogPromptProps) => {
  const hasButtons = !!buttonTextCancel || !!buttonTextConfirm

  return (
    <ModalBase
      disclosure={disclosureElement}
      baseId={baseId}
      aria-label={ariaLabel}
      initialVisibility={initialVisibility}
      className={styles.dialog}
    >
      {({ closeModal }: { closeModal: () => void }) => {
        const handleClose = () => {
          onCancel && onCancel()
          closeModal()
        }
        const handleConfirm = () => {
          onConfirm && onConfirm()
          closeModal()
        }
        return (
          <Box
            position="relative"
            marginX={3}
            paddingX={[1, 4, 4, 8]}
            paddingY={[6, 6, 6, 12]}
            borderRadius="large"
            background="white"
            className={styles.content}
          >
            <GridContainer position="none">
              <FocusableBox
                component="button"
                onClick={handleClose}
                className={styles.close}
              >
                <Icon icon="close" color="blue400" size="medium" />
              </FocusableBox>
              <Text variant="h2" as="h3" paddingBottom={2}>
                {title}
              </Text>
              {description && (
                <Text variant="intro" paddingBottom={2}>
                  {description}
                </Text>
              )}
              {hasButtons && (
                <GridRow align="spaceBetween">
                  {buttonTextCancel && (
                    <GridColumn
                      span={['12/12', '12/12', '1/3']}
                      paddingTop={[2, 2, 7]}
                    >
                      <Button
                        size="default"
                        variant="ghost"
                        onClick={handleClose}
                        fluid
                      >
                        {buttonTextCancel}
                      </Button>
                    </GridColumn>
                  )}
                  {buttonTextConfirm && (
                    <GridColumn
                      span={['12/12', '12/12', '1/3']}
                      paddingTop={[2, 2, 7]}
                    >
                      <Button size="default" onClick={handleConfirm} fluid>
                        {buttonTextConfirm}
                      </Button>
                    </GridColumn>
                  )}
                </GridRow>
              )}
            </GridContainer>
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default DialogPrompt
