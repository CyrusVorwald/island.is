import { getValueViaPath } from '@island.is/application/core'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { DrivingLicenseFakeData, YES } from '../lib/constants'
import { Eligibility, DrivingLicense } from '../types/schema'

export interface CurrentLicenseProviderResult {
  currentLicense: Eligibility['name'] | null
  healthRemarks?: string[]
  issued?: string
  expires?: string
}
export class CurrentLicenseProvider extends BasicDataProvider {
  type = 'CurrentLicenseProvider'

  async provide(
    application: Application,
  ): Promise<CurrentLicenseProviderResult> {
    const fakeData = getValueViaPath<DrivingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    if (fakeData?.useFakeData === YES) {
      return {
        currentLicense: fakeData.currentLicense === 'temp' ? 'B' : null,
        healthRemarks:
          fakeData.healthRemarks === YES
            ? ['Gervilimur eða gervilimir/stoðtæki fyrir fætur og hendur.']
            : undefined,
      }
    }

    const query = `
      query LicenseQuery {
        drivingLicense {
          categories {
            name
          }
          healthRemarks
          expires
          issued
        }
      }
    `

    const res = await this.useGraphqlGateway<{
      drivingLicense: DrivingLicense | null
    }>(query)

    if (!res.ok) {
      console.error('[CurrentLicenseProvider]', await res.json())

      return Promise.reject({
        reason: 'Náði ekki sambandi við vefþjónustu',
      })
    }

    const response = await res.json()

    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }
    const categoryB = (response.data?.drivingLicense?.categories ?? []).find(
      (cat) => cat.name === 'B',
    )

    console.log(response.data?.drivingLicense)

    return {
      currentLicense: categoryB ? categoryB.name : null,
      healthRemarks: response.data?.drivingLicense?.healthRemarks,
      issued: response.data?.drivingLicense?.issued ?? '0',
      expires: response.data?.drivingLicense?.expires ?? '0',
    }
  }

  onProvideError(_: unknown): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorCurrentLicenseProvider,
      status: 'failure',
    }
  }

  onProvideSuccess(
    result: CurrentLicenseProviderResult,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
