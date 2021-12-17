import React, { useRef, useState } from 'react'
import { HTMLText } from '@island.is/regulations-tools/types'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '../utils'

export type DraftingNotesProps = {
  draft: RegDraftForm
  onChange: (notes: HTMLText) => void
}

export const DraftingNotes = (props: DraftingNotesProps) => {
  const { draft, onChange } = props

  const t = useLocale().formatMessage
  const notesRef = useRef(() => draft.draftingNotes.value)

  const [expanded, setExpanded] = useState(!!draft.draftingNotes.value)

  return (
    <Box marginTop={[6, 6, 8]}>
      <Accordion>
        <AccordionItem
          id={draft.id + '-notes'}
          label={t(msg.draftingNotes)}
          expanded={expanded}
          onToggle={setExpanded}
        >
          {expanded && (
            <Box marginBottom={2}>
              <EditorInput
                label={t(msg.draftingNotes)}
                hiddenLabel
                isImpact={false}
                draftId={`${draft.id}-notes`}
                valueRef={notesRef}
                onBlur={() =>
                  onChange(
                    notesRef
                      .current()
                      // Replace empty HTML with empty string ('')
                      // TODO: See if this should rather happen in the reducer/action
                      .replace(/(<(?!\/)[^>]+>)+(<\/[^>]+>)+/, '') as HTMLText,
                  )
                }
              />
              <Text as="p" variant="small" marginTop={2}>
                {t(msg.draftingNotes_descr)}
              </Text>
            </Box>
          )}
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
