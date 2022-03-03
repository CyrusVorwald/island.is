import { DynamicModule, Module } from '@nestjs/common'

import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import {
  RSK_OPTIONS,
  RSKService,
  RSKServiceOptions,
} from '@island.is/clients/rsk/v1'

import { CompanyRegistryResolver } from './api-domains-company-registry.resolver'
import { RskCompanyInfoService } from './rsk-company-info.service'

@Module({})
export class CompanyRegistryModule {
  static register(config: RSKServiceOptions): DynamicModule {
    return {
      module: CompanyRegistryModule,
      providers: [
        RskCompanyInfoService,
        CompanyRegistryResolver,
        {
          provide: RSK_OPTIONS,
          useValue: config,
        },
        RSKService,
      ],
      imports: [CompanyRegistryClientModule],
    }
  }
}
