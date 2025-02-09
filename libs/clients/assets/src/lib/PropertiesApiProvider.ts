import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import nodeFetch, { Request } from 'node-fetch'

import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration, FasteignirApi } from '../../gen/fetch'
import { AssetsClientConfig } from './assets.config'

export const PropertiesApiProvider: Provider<FasteignirApi> = {
  provide: FasteignirApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof AssetsClientConfig>,
  ) =>
    new FasteignirApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-assets',
          ...config.fetch,
          fetch: (url, init) => {
            // The Properties API expects two different authorization headers for some reason.
            const request = new Request(url, init)
            request.headers.set(
              'authorization-identity',
              request.headers.get('authorization') ?? '',
            )
            return nodeFetch(request)
          },
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, AssetsClientConfig.KEY],
}
