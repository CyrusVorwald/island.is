import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  CaseInfo,
  FormContentContainer,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { isCourtHearingArrangemenstStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  CaseCustodyRestrictions,
  CaseType,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  RestrictionCaseCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  rcHearingArrangements as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import CourtArrangements, {
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components/CourtArrangements'
import * as constants from '@island.is/judicial-system/consts'

export const HearingArrangements: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const [modalVisible, setModalVisible] = useState(false)

  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const {
    setAndSendToServer,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    setCourtDate,
    courtDateHasChanged,
    handleCourtDateChange,
  } = useCourtArrangements(workingCase)

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      if (!workingCase.courtDate) {
        setCourtDate(workingCase.requestedCourtDate)

        setInitialAutoFillDone(true)
      }

      setAndSendToServer(
        [
          // validToDate, isolationToDate and isCustodyIsolation are autofilled here
          // so they are ready for conclusion autofill later
          {
            validToDate: workingCase.requestedValidToDate,
            isolationToDate:
              workingCase.type === CaseType.CUSTODY ||
              workingCase.type === CaseType.ADMISSION_TO_FACILITY
                ? workingCase.requestedValidToDate
                : undefined,
            isCustodyIsolation:
              workingCase.type === CaseType.CUSTODY ||
              workingCase.type === CaseType.ADMISSION_TO_FACILITY
                ? workingCase.requestedCustodyRestrictions &&
                  workingCase.requestedCustodyRestrictions.includes(
                    CaseCustodyRestrictions.ISOLATION,
                  )
                  ? true
                  : false
                : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [
    setAndSendToServer,
    initialAutoFillDone,
    isCaseUpToDate,
    setCourtDate,
    setWorkingCase,
    workingCase,
  ])

  const handleNextButtonClick = useCallback(() => {
    const hasSentNotification = workingCase?.notifications?.find(
      (notification) => notification.type === NotificationType.COURT_DATE,
    )

    setAndSendToServer(
      [
        {
          courtDate: courtDate
            ? formatDateForServer(new Date(courtDate))
            : undefined,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )

    if (hasSentNotification && !courtDateHasChanged) {
      router.push(
        `${constants.RESTRICTION_CASE_RULING_ROUTE}/${workingCase.id}`,
      )
    } else {
      setModalVisible(true)
    }
  }, [
    workingCase,
    setAndSendToServer,
    courtDate,
    setWorkingCase,
    courtDateHasChanged,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={RestrictionCaseCourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.hearingArrangements)}
      />
      <FormContentContainer>
        {workingCase.comments && (
          <Box marginBottom={5}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.comments.title)}
              message={workingCase.comments}
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.requestedCourtDate.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <CourtArrangements
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              handleCourtDateChange={handleCourtDateChange}
              selectedCourtDate={courtDate}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <DefenderInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${workingCase.id}`}
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={formatMessage(m.continueButton.label)}
          nextIsDisabled={
            !isCourtHearingArrangemenstStepValidRC(workingCase, courtDate)
          }
        />
      </FormContentContainer>
      {modalVisible && (
        <Modal
          title={formatMessage(
            workingCase.type === CaseType.CUSTODY ||
              workingCase.type === CaseType.ADMISSION_TO_FACILITY
              ? m.modal.custodyCases.heading
              : m.modal.travelBanCases.heading,
          )}
          text={formatMessage(
            workingCase.type === CaseType.CUSTODY ||
              workingCase.type === CaseType.ADMISSION_TO_FACILITY
              ? m.modal.custodyCases.text
              : m.modal.travelBanCases.text,
            {
              courtDateHasChanged,
            },
          )}
          isPrimaryButtonLoading={isSendingNotification}
          handleSecondaryButtonClick={() => {
            sendNotification(workingCase.id, NotificationType.COURT_DATE, true)

            router.push(
              `${constants.RESTRICTION_CASE_RULING_ROUTE}/${workingCase.id}`,
            )
          }}
          handlePrimaryButtonClick={async () => {
            const notificationSent = await sendNotification(
              workingCase.id,
              NotificationType.COURT_DATE,
            )

            if (notificationSent) {
              router.push(
                `${constants.RESTRICTION_CASE_RULING_ROUTE}/${workingCase.id}`,
              )
            }
          }}
          primaryButtonText={formatMessage(m.modal.shared.primaryButtonText)}
          secondaryButtonText={formatMessage(
            m.modal.shared.secondaryButtonText,
          )}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
