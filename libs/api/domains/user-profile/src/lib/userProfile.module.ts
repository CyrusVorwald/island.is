import { DynamicModule } from '@nestjs/common'

import {
  IslykillApiModule,
  IslykillApiModuleConfig,
} from '@island.is/clients/islykill'
import { Configuration, UserProfileApi } from '@island.is/clients/user-profile'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { IslykillService } from './islykill.service'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'

export interface Config {
  userProfileServiceBasePath: string
  islykill: IslykillApiModuleConfig
}

export class UserProfileModule {
  static register(config: Config): DynamicModule {
    return {
      module: UserProfileModule,
      providers: [
        UserProfileService,
        UserProfileResolver,
        IslykillService,
        {
          provide: UserProfileApi,
          useFactory: () =>
            new UserProfileApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.userProfileServiceBasePath,
              }),
            ),
        },
      ],
      imports: [
        IslykillApiModule.register({
          cert: config.islykill.cert,
          passphrase: config.islykill.passphrase,
          basePath: config.islykill.basePath,
        }),
        FeatureFlagModule,
      ],
      exports: [],
    }
  }
}
