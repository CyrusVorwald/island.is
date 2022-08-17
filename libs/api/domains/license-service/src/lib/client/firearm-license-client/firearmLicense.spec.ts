import { getCurrentUser } from '@island.is/auth-nest-tools'
import {
  FirearmLicenseClientModule,
  FirearmLicenseClientConfig,
  FirearmApplicationApi,
} from '@island.is/clients/firearm-license'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { Test } from '@nestjs/testing'
import { GenericFirearmLicenseApi } from './firearmLicenseService.api'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { startMocking } from '@island.is/shared/mocking'
import { requestHandlers } from '../../__mock-data__/requestHandlers'

startMocking(requestHandlers)
describe('FirearmLicenseService', () => {
  let service: GenericFirearmLicenseApi

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        FirearmLicenseClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [FirearmLicenseClientConfig],
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig],
        }),
      ],
      providers: [
        GenericFirearmLicenseApi,
        { provide: 'CONFIG', useValue: {} },
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            warn: () => undefined,
          },
        },
      ],
    }).compile()

    service = module.get(GenericFirearmLicenseApi)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getFirearmLicense', () => {
    const user = createCurrentUser()
    it('shouldnt return a license', async () => {
      const response = await service.getLicense(user)
      console.log(response)
    })
  })
})
