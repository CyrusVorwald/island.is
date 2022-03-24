import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { SessionArrangements } from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

import HearingArrangementsForm from './HearingArrangementsForm'
const HearingArrangements = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const { autofill, autofillSessionArrangements } = useCase()

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase

      if (theCase.requestedCourtDate) {
        autofill('courtDate', theCase.requestedCourtDate, theCase)
      }

      if (theCase.defenderName) {
        autofillSessionArrangements(
          'sessionArrangements',
          SessionArrangements.ALL_PRESENT,
          theCase,
        )
      }

      setWorkingCase(theCase)
    }
  }, [
    autofill,
    autofillSessionArrangements,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.court.investigationCases.hearingArrangements,
        )}
      />
      {user && (
        <HearingArrangementsForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          user={user}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
