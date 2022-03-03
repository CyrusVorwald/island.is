import { Test } from '@nestjs/testing'

import {
  FILE_STORAGE_CONFIG,
  FileStorageConfig,
} from './file-storage.configuration'
import { FileStorageService } from './file-storage.service'

describe('FileStorageService', () => {
  let service: FileStorageService

  beforeEach(async () => {
    const config: FileStorageConfig = { uploadBucket: 'test-bucket' }
    const module = await Test.createTestingModule({
      providers: [
        FileStorageService,
        {
          provide: FILE_STORAGE_CONFIG,
          useValue: config,
        },
      ],
    }).compile()

    service = module.get(FileStorageService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
