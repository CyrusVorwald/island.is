import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { initializeClient } from '@island.is/application/graphql'
import { ErrorShell, HeaderInfoProvider } from '@island.is/application/ui-shell'
import { Authenticator } from '@island.is/auth/react'
import { LocaleProvider } from '@island.is/localization'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'

import { Layout } from '../components/Layout/Layout'
import { environment } from '../environments'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { AssignApplication } from '../routes/AssignApplication'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <Router basename="/umsoknir">
        <Authenticator>
          <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
            <HeaderInfoProvider>
              <Layout>
                <Switch>
                  <Route
                    exact
                    path="/tengjast-umsokn"
                    component={AssignApplication}
                  />

                  <Route exact path="/:slug" component={Applications} />
                  <Route exact path="/:slug/:id" component={Application} />

                  <Route path="*">
                    <ErrorShell />
                  </Route>
                </Switch>
              </Layout>
            </HeaderInfoProvider>
          </FeatureFlagProvider>
        </Authenticator>
      </Router>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
