import type { CyHttpMessages } from 'cypress/types/net-stubbing'
import { BaseUrl, AuthUrl } from '../lib/types'
import type { TestEnvironment } from '../lib/types'

const cypressError = (msg: string) => {
  throw new Error(msg)
}

import type { ADSUserWithDiscount, FixtureUser } from '../lib/types'

const getCognitoCredentials = () => {
  return {
    username:
      process.env.AWS_COGNITO_USERNAME ||
      cypressError('AWS_COGNITO_USERNAME env variable missing'),
    password:
      process.env.AWS_COGNITO_PASSWORD ||
      cypressError('AWS_COGNITO_PASSWORD env variable missing'),
  }
}

const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  const { body } = req
  return typeof body === 'object' && body.operationName === operationName
}

const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = operationName
  }
}

const getFakeUser = (fakeUsers: FixtureUser[], name: string): FixtureUser =>
  fakeUsers
    .filter((e) => e.name.toLowerCase().includes(name.toLowerCase()))
    .reduce((e) => e)

const getDiscountUser = (
  fakeUser: FixtureUser,
  discounts: ADSUserWithDiscount[],
) =>
  discounts.filter((e) => e.nationalId === fakeUser.nationalId).reduce((e) => e)

const getDiscountData = (
  fakeUser: FixtureUser,
  res: CyHttpMessages.BaseMessage | undefined,
) => {
  const discounts =
    (res?.body.data.discounts as ADSUserWithDiscount[]) ||
    cypressError('Error getting response data')
  return { discounts, user: getDiscountUser(fakeUser, discounts) }
}

const getEnvironmentUrls = (env: TestEnvironment) => {
  return env === 'dev'
    ? { authUrl: AuthUrl.dev, baseUrl: BaseUrl.dev }
    : env === 'prod'
    ? { authUrl: AuthUrl.prod, baseUrl: BaseUrl.prod }
    : env === 'staging'
    ? { authUrl: AuthUrl.staging, baseUrl: BaseUrl.staging }
    : { authUrl: AuthUrl.local, baseUrl: BaseUrl.local }
}

export {
  cypressError,
  getCognitoCredentials,
  hasOperationName,
  aliasQuery,
  getFakeUser,
  getDiscountData,
  getEnvironmentUrls,
}
