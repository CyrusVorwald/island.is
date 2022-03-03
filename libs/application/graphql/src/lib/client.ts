import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import fetch from 'cross-fetch'

import { authLink } from '@island.is/auth/react'

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path, extensions }) => {
      const problem = JSON.stringify(extensions?.problem, null, '  ')
      console.log(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Problem: ${problem}`,
      )
    })

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const initializeClient = (baseApiUrl: string) => {
  const httpLink = new HttpLink({
    uri: ({ operationName }) => `${baseApiUrl}/api/graphql?op=${operationName}`,
    fetch,
  })

  return new ApolloClient({
    link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  })
}
