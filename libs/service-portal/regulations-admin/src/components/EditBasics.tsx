import React, { useEffect, useState } from 'react'
import * as s from './EditBasics.css'
import {
  Box,
  Accordion,
  AccordionItem,
  Divider,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '@island.is/localization'
import { Appendixes } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'
import { useDraftingState } from '../state/useDraftingState'
import { cleanTitle } from '@island.is/regulations-tools/cleanTitle'
import { HTMLText } from '@island.is/regulations-tools/types'
import { useUploadImageUrls } from '../utils/dataHooks'

export const EditBasics = () => {
  const t = useLocale().formatMessage
  const { draft, actions } = useDraftingState()
  const [pristineTitle, setPristineTitle] = useState(true)

  const { text, appendixes } = draft
  const { updateState } = actions

  const { uploadImageUrls, UploadErrorMessage } = useUploadImageUrls()

  const startTextExpanded =
    !text.value || appendixes.length === 0 || !!text.error

  const regType =
    draft.type.value &&
    (draft.type.value === 'amending' ? msg.type_amending : msg.type_base)

  const updateDraftText = (newText: HTMLText) => {
    const sources = newText.match(/<img [^>]*src="[^"]*"[^>]*>/gm) ?? []
    const imgSources = sources.map((x) => x.replace(/.*src="([^"]*)".*/, '$1'))

    uploadImageUrls(imgSources, draft.id)
  }

  return (
    <>
      <Box marginBottom={3}>
        {!draft.title.value && pristineTitle && (
          <Box className={s.shortcuts} marginBottom={[2, 2, 3]}>
            Flýtileiðir:
            <Box className={s.shortcutsButton}>
              <Button
                onClick={() => updateState('title', 'Reglugerð um ')}
                variant="text"
                size="small"
              >
                {t(msg.type_base)}
              </Button>
            </Box>
            <Box className={s.shortcutsButton}>
              <Button
                onClick={() =>
                  updateState('title', 'Reglugerð um breytingu á reglugerð um ')
                }
                variant="text"
                size="small"
              >
                {t(msg.type_amending)}
              </Button>
            </Box>
            <Box className={s.shortcutsButton}>
              <Button
                onClick={() =>
                  updateState(
                    'title',
                    'Reglugerð um brottfellingu reglugerðar um ',
                  )
                }
                variant="text"
                size="small"
              >
                {t(msg.type_repealing)}
              </Button>
            </Box>
          </Box>
        )}
        <MagicTextarea
          label={t(msg.title)}
          name="title"
          defaultValue={draft.title.value}
          onBlur={(value) => {
            if (pristineTitle) {
              setPristineTitle(false)
            }
            updateState('title', cleanTitle(value))
          }}
          error={
            draft.title.showError && draft.title.error && t(draft.title.error)
          }
          required={!!draft.title.required}
        />
        <Box marginTop={1} marginLeft={1}>
          <Text variant="small" color="dark200">
            {regType ? `(${regType})` : ' '}
          </Text>
        </Box>
      </Box>
      <Box marginBottom={[6, 6, 8]}>
        <Accordion>
          <AccordionItem
            id={draft.id}
            label={t(msg.text)}
            startExpanded={startTextExpanded}
          >
            <Box marginBottom={3}>
              <EditorInput
                label={t(msg.text)}
                hiddenLabel
                draftId={draft.id}
                value={text.value}
                onChange={updateDraftText}
                error={text.showError && text.error && t(text.error)}
              />
            </Box>
            <Box>
              <Divider />
              {' '}
            </Box>
            {draft.signedDocumentUrl && (
              <Box marginBottom={[4, 4, 6]}>
                <EditorInput
                  label={t(msg.signatureText)}
                  draftId={draft.id}
                  value={draft.signatureText.value}
                  onChange={(text) => updateState('signatureText', text)}
                  readOnly
                />
              </Box>
            )}
          </AccordionItem>
        </Accordion>

        <Appendixes
          draftId={draft.id}
          appendixes={appendixes}
          actions={actions}
        />
      </Box>
    </>
  )
}
