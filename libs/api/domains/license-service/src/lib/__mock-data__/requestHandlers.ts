import { rest } from 'msw'
import ValidLicense from './validLicense.json'

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_FIREARM_LICENSE_PATH =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/island-api-v1'

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.get(
    url(
      `${XROAD_FIREARM_LICENSE_PATH}/api/FirearmApplication/LicenseInfo/:nationalId`,
    ),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([ValidLicense]))
    },
  ),
]
