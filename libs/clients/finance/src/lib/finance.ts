import { Inject } from '@nestjs/common'
import { Base64 } from 'js-base64'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  FinanceStatus
} from './finance.types'

export const FINANCE_OPTIONS = 'FINANCE_OPTIONS'

export interface FinanceServiceOptions {
  url: string
  username: string
  password: string
  ttl?: number
}

export class FinanceService extends RESTDataSource {
  constructor(
    @Inject(FINANCE_OPTIONS)
    private readonly options: FinanceServiceOptions,
  ) {
    super()
    this.baseURL = `${this.options.url}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  async getFinanceStatus(
    nationalId: string,
  ): Promise<FinanceStatus | null> {
    const response = await this.get<FinanceStatus | null>(
      // `/customerStatusByOrganization?nationalID=${nationalId}`,
      `/customerStatusByOrganization?nationalID=${process.env.FINANCE_TEST_USER}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }
}
