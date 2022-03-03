import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import {
  Header,
  UserProvider,
} from '@island.is/judicial-system-web/src/components'
import { CurrentUserQuery } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { LocaleProvider } from '@island.is/localization'

const mockJudgeQuery = {
  request: {
    query: CurrentUserQuery,
  },
  result: {
    data: {
      currentUser: mockJudge,
    },
  },
}

describe('UserProvider', () => {
  test('should load the user', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      pathname: 'test',
    }))

    render(
      <MockedProvider mocks={[mockJudgeQuery]} addTypename={false}>
        <UserProvider authenticated={true}>
          <LocaleProvider locale="is" messages={{}}>
            <Header />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    /**
     * A logout button is displayed in the header when a user is logged in.
     * By ensuring that that button is in the document we know that the
     * user is being set.
     */
    expect(
      await screen.findByRole('button', { name: 'Wonder Woman' }),
    ).toBeInTheDocument()
  })
})
