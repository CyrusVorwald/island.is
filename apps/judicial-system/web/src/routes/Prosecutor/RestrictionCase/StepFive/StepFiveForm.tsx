import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'

import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  Input,
  Tooltip,
  Checkbox,
  Button,
  LoadingDots,
  UploadFile,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  Case,
  CaseFile,
  CaseFileState,
  CaseOrigin,
  User,
} from '@island.is/judicial-system/types'
import {
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseInfo,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import { rcCaseFiles as m } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'

import { PoliceCaseFilesData } from './StepFive'
import { PoliceCaseFilesMessageBox } from '../../SharedComponents/PoliceCaseFilesMessageBox/PoliceCaseFilesMessageBox'
import * as styles from './StepFive.css'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  policeCaseFiles?: PoliceCaseFilesData
  user?: User
}

interface PoliceCaseFile {
  id: string
  label: string
  checked: boolean
}

export const StepFiveForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, policeCaseFiles, user } = props
  const { formatMessage } = useIntl()
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFile[]
  >([])
  const [checkAllChecked, setCheckAllChecked] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const {
    uploadErrorMessage,
    allFilesUploaded,
    uploadPoliceCaseFile,
    addFileToCase,
    onRemove,
    onRetry,
    onChange,
    files,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

  useEffect(() => {
    if (policeCaseFiles) {
      const policeCaseFilesNotStoredInRVG = policeCaseFiles.files.filter(
        (p) => {
          const xFiles = files as CaseFile[]

          return !xFiles.find((f) => f.name === p.name && f.key)
        },
      )

      if (policeCaseFilesNotStoredInRVG.length !== policeCaseFileList.length) {
        setPoliceCaseFileList(
          policeCaseFilesNotStoredInRVG.map((policeCaseFile) => {
            return {
              id: policeCaseFile.id,
              label: policeCaseFile.name,
              checked:
                policeCaseFileList.find((p) => p.id === policeCaseFile.id)
                  ?.checked || false,
            }
          }),
        )
      }
    }
  }, [policeCaseFiles, files, policeCaseFileList])

  const toggleCheckbox = (
    evt: React.ChangeEvent<HTMLInputElement>,
    checkAll?: boolean,
  ) => {
    const newPoliceCaseFileList = [...policeCaseFileList]
    const target = policeCaseFileList.findIndex(
      (listItem) => listItem.id.toString() === evt.target.value,
    )

    if (checkAll) {
      setCheckAllChecked(!checkAllChecked)
      setPoliceCaseFileList(
        policeCaseFileList.map((l) => {
          return { id: l.id, label: l.label, checked: evt.target.checked }
        }),
      )
    } else {
      newPoliceCaseFileList[target].checked = !newPoliceCaseFileList[target]
        .checked
      setPoliceCaseFileList(newPoliceCaseFileList)
    }
  }

  const uploadToRVG = async () => {
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)
    let newPoliceCaseFileList = [...policeCaseFileList]

    setIsUploading(true)

    filesToUpload.forEach(async (policeCaseFile, index) => {
      const { key, size } = await uploadPoliceCaseFile(
        policeCaseFile.id,
        policeCaseFile.label,
      )

      await addFileToCase({
        type: 'application/pdf',
        name: policeCaseFile.label,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
        key,
        size,
      } as UploadFile)

      newPoliceCaseFileList = newPoliceCaseFileList.filter(
        (p) => p.id !== policeCaseFile.id,
      )

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
        setCheckAllChecked(false)
      }
    })

    setPoliceCaseFileList(newPoliceCaseFileList)
  }

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.description.heading)}
            </Text>
          </Box>
          <MarkdownWrapper
            markdown={formatMessage(m.sections.description.list)}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.policeCaseFiles.heading, {
              policeCaseNumber: workingCase.policeCaseNumber,
            })}
          </Text>
          <Text marginTop={1}>
            {formatMessage(m.sections.policeCaseFiles.introduction)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          {workingCase.origin === CaseOrigin.LOKE && (
            <AnimateSharedLayout>
              <motion.div layout className={styles.policeCaseFilesContainer}>
                <motion.ul layout>
                  <motion.li
                    layout
                    className={cn(styles.policeCaseFile, {
                      [styles.selectAllPoliceCaseFiles]: true,
                    })}
                  >
                    <Checkbox
                      name="selectAllPoliceCaseFiles"
                      label={formatMessage(
                        m.sections.policeCaseFiles.selectAllLabel,
                      )}
                      checked={checkAllChecked}
                      onChange={(evt) => toggleCheckbox(evt, true)}
                      disabled={isUploading || policeCaseFileList.length === 0}
                      strong
                    />
                  </motion.li>
                  {policeCaseFiles?.isLoading ? (
                    <Box
                      textAlign="center"
                      paddingY={2}
                      paddingX={3}
                      marginBottom={2}
                    >
                      <LoadingDots />
                    </Box>
                  ) : policeCaseFiles?.hasError ? (
                    policeCaseFiles?.errorCode ===
                    'https://httpstatuses.com/404' ? (
                      <PoliceCaseFilesMessageBox
                        icon="warning"
                        iconColor="yellow400"
                        message={formatMessage(
                          m.sections.policeCaseFiles.caseNotFoundInLOKEMessage,
                        )}
                      />
                    ) : (
                      <PoliceCaseFilesMessageBox
                        icon="close"
                        iconColor="red400"
                        message={formatMessage(
                          m.sections.policeCaseFiles.couldNotGetFromLOKEMessage,
                        )}
                      />
                    )
                  ) : policeCaseFiles?.files.length === 0 ? (
                    <PoliceCaseFilesMessageBox
                      icon="warning"
                      iconColor="yellow400"
                      message={formatMessage(
                        m.sections.policeCaseFiles.noFilesFoundInLOKEMessage,
                      )}
                    />
                  ) : policeCaseFileList.length > 0 ? (
                    <AnimatePresence>
                      {policeCaseFileList.map((listItem) => {
                        return (
                          <motion.li
                            layout
                            className={styles.policeCaseFile}
                            key={listItem.label}
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                          >
                            <Checkbox
                              label={
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="spaceBetween"
                                >
                                  {listItem.label}
                                  {isUploading && listItem.checked && (
                                    <LoadingDots />
                                  )}
                                </Box>
                              }
                              name={listItem.id}
                              value={listItem.id}
                              checked={listItem.checked}
                              onChange={(evt) => toggleCheckbox(evt)}
                            />
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  ) : (
                    <PoliceCaseFilesMessageBox
                      icon="checkmark"
                      iconColor="blue400"
                      message={formatMessage(
                        m.sections.policeCaseFiles.allFilesUploadedMessage,
                      )}
                    />
                  )}
                </motion.ul>
              </motion.div>
              <motion.div layout className={styles.uploadToRVGButtonContainer}>
                <Button
                  onClick={uploadToRVG}
                  loading={isUploading}
                  disabled={policeCaseFileList.length === 0}
                >
                  {formatMessage(m.sections.policeCaseFiles.uploadButtonLabel)}
                </Button>
              </motion.div>
            </AnimateSharedLayout>
          )}{' '}
          {workingCase.origin !== CaseOrigin.LOKE && (
            <AlertMessage
              type="info"
              title={formatMessage(
                m.sections.policeCaseFiles.originNotLokeTitle,
              )}
              message={formatMessage(
                m.sections.policeCaseFiles.originNotLokeMessage,
              )}
            />
          )}
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.files.heading)}
          </Text>
          <Text marginTop={1}>
            {formatMessage(m.sections.files.introduction)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              name="fileUpload"
              fileList={files}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={onChange}
              onRemove={(file) => {
                onRemove(file)
                setPoliceCaseFileList([
                  ...policeCaseFileList,
                  (file as unknown) as PoliceCaseFile,
                ])
              }}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              disabled={isUploading}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(m.sections.comments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(m.sections.comments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(m.sections.comments.label)}
              placeholder={formatMessage(m.sections.comments.placeholder)}
              value={workingCase.caseFilesComments || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(workingCase.id, {
                  caseFilesComments: evt.target.value,
                })
              }
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.STEP_SIX_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded || isUploading}
        />
      </FormContentContainer>
    </>
  )
}
