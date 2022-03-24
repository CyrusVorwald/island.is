import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'

import { PoliceCaseFile } from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

import { StepFiveForm } from './StepFiveForm'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
}

export const StepFive: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  const { formatMessage } = useIntl()

  const router = useRouter()
  const id = router.query.id

  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useQuery(PoliceCaseFilesQuery, {
    variables: { input: { caseId: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (policeData && policeData.policeCaseFiles) {
      setPoliceCaseFiles({
        files: policeData.policeCaseFiles,
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataLoading) {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: false,
        hasError: true,
        errorMessage: policeDataError?.message,
      })
    }
  }, [policeData, policeDataError?.message, policeDataLoading])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_FIVE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.caseFiles)}
      />
      <StepFiveForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        policeCaseFiles={policeCaseFiles}
        user={user}
      />
    </PageLayout>
  )
}

export default StepFive
