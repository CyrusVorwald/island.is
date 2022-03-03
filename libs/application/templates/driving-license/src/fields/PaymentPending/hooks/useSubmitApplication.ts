import { MutationTuple, useMutation } from '@apollo/client'

import { Application,DefaultEvents } from '@island.is/application/core'

import { SUBMIT_APPLICATION } from './queries.graphql'

export interface UseSubmitApplication {
  (params: {
    application: Application
    refetch: (() => void) | undefined
    event: DefaultEvents
  }): MutationTuple<
    void,
    {
      input: {
        id: Application['id']
        event: DefaultEvents
        answers: Application['answers']
      }
    }
  >
}

export const useSubmitApplication: UseSubmitApplication = ({
  application,
  refetch,
  event,
}) => {
  return useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
    onCompleted: () => {
      refetch?.()
    },
    variables: {
      input: {
        id: application.id,
        event,
        answers: application.answers,
      },
    },
  })
}
