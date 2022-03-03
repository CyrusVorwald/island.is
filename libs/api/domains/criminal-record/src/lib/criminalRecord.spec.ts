import { Test } from '@nestjs/testing'
import { createLogger } from 'winston'

import { CriminalRecordApiModule } from '@island.is/clients/criminal-record'
import { startMocking } from '@island.is/shared/mocking'

import {
  MOCK_NATIONAL_ID,
  MOCK_NATIONAL_ID_NOT_EXISTS,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { CriminalRecordService } from './criminalRecord.service'

startMocking(requestHandlers)

describe('CriminalRecordService', () => {
  let service: CriminalRecordService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CriminalRecordApiModule.register({
          xroadBaseUrl: 'http://localhost',
          xroadClientId: '',
          xroadPath: 'v2',
          fetchOptions: {
            logger: createLogger({
              silent: true,
            }),
          },
        }),
      ],
      providers: [CriminalRecordService, { provide: 'CONFIG', useValue: {} }],
    }).compile()

    service = module.get(CriminalRecordService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getCriminalRecord', () => {
    it('should return a result', async () => {
      const response = await service.getCriminalRecord(MOCK_NATIONAL_ID)

      expect(response.contentBase64).toBeTruthy()
    })

    it('should throw an error', async () => {
      return await service
        .getCriminalRecord(MOCK_NATIONAL_ID_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('validateCriminalRecord', () => {
    it('should not throw an error', async () => {
      expect(async () => {
        await service.validateCriminalRecord(MOCK_NATIONAL_ID)
      }).not.toThrowError()
    })

    it('should throw an error', async () => {
      return await service
        .validateCriminalRecord(MOCK_NATIONAL_ID_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })
})
