import { Test } from '@nestjs/testing'
import { createApplication } from '@island.is/testing/fixtures'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { ApplicationService } from '@island.is/application/api/core'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { AwsService } from '@island.is/nest/aws'
import {
  ApplicationFilesConfig,
  ApplicationFilesModule,
  AttachmentDeleteResult,
  FileService,
} from '@island.is/application/api/files'
import {
  ApplicationConfig,
  APPLICATION_CONFIG,
} from '../../application.configuration'
import { LoggingModule } from '@island.is/logging'
import { ApplicationChargeService } from '../../charge/application-charge.service'
import { ConfigModule } from '@nestjs/config'
import { signingModuleConfig, SigningService } from '@island.is/dokobit-signing'
import { FileStorageConfig, FileStorageService } from '@island.is/file-storage'

let lifeCycleService: ApplicationLifeCycleService
let awsService: AwsService

export const createApplications = () => {
  return [
    createApplication({
      answers: {
        question: 'yes',
        isAnotherQuestion: 'yes',
        attachments: {
          files: {
            file: [
              {
                key: 'key',
                name: 'doc.pdf',
              },
              {
                key: 'anotherkey',
                name: 'anotherDoc.pdf',
              },
            ],
          },
        },
      },
      attachments: {
        key: 's3://example-bucket/path/to/object',
        anotherkey: 's3://example-bucket/path/to/object1',
      },
      externalData: {
        nationalRegistry: {
          data: {
            age: 35,
          },
          date: new Date(),
          status: 'success',
        },
        submitApplication: {
          data: {
            id: 11,
          },
          date: new Date(),
          status: 'success',
        },
      },
    }),
  ]
}

class ApplicationServiceMock {
  findAllDueToBePruned(): Application[] {
    return createApplications()
  }
  update(
    id: string,
    application: Partial<
      Pick<Application, 'attachments' | 'answers' | 'externalData'>
    >,
  ) {
    return { numberOfAffectedRows: 1, updatedApplication: application }
  }
}

class ApplicationChargeServiceMock {
  async deleteCharge(application: Pick<Application, 'id' | 'externalData'>) {
    // do nothing
  }
}

describe('ApplicationLifecycleService Unit tests', () => {
  beforeAll(async () => {
    const config: ApplicationConfig = {
      presignBucket: 'bucket',
      attachmentBucket: 'bucket2',
    }
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        ApplicationFilesModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            signingModuleConfig,
            ApplicationFilesConfig,
            FileStorageConfig,
          ],
        }),
      ],
      providers: [
        {
          provide: ApplicationService,
          useClass: ApplicationServiceMock,
        },
        {
          provide: ApplicationChargeService,
          useClass: ApplicationChargeServiceMock,
        },
        ApplicationLifeCycleService,
      ],
    }).compile()

    awsService = module.get<AwsService>(AwsService)
    lifeCycleService = module.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })

  it('should prune answers and prune true.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(awsService, 'deleteObject')
      .mockResolvedValue()

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const result = lifeCycleService.getProcessingApplications()
    expect(deleteObjectSpy).toHaveBeenCalledTimes(2)

    expect(result[0].application.attachments).toEqual({})
    expect(result[0].application.answers).toEqual({})
    expect(result[0].application.externalData).toEqual({})
    expect(result[0].pruned).toEqual(true)
  })

  it('should prune answers leave one attachment on exist true.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(awsService, 'deleteObject')
      .mockReset()
      .mockImplementationOnce(() => {
        throw new Error('Error')
      })
      .mockResolvedValueOnce()

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const result = lifeCycleService.getProcessingApplications()
    expect(deleteObjectSpy).toHaveBeenCalledTimes(2)

    expect(result[0].application.attachments).toEqual({
      key: 's3://example-bucket/path/to/object',
    })

    expect(result[0].application.answers).toEqual({})
    expect(result[0].application.externalData).toEqual({})
    expect(result[0].pruned).toEqual(false)
  })

  it('should not remove attachments if deleteObject throws Error.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(awsService, 'deleteObject')
      .mockReset()
      .mockImplementation(() => {
        throw new Error('Error')
      })

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const result = lifeCycleService.getProcessingApplications()
    expect(deleteObjectSpy).toHaveBeenCalled()

    expect(result[0].application.attachments).toEqual({
      key: 's3://example-bucket/path/to/object',
      anotherkey: 's3://example-bucket/path/to/object1',
    })

    expect(result[0].application.answers).toEqual({})
    expect(result[0].application.externalData).toEqual({})
    expect(result[0].pruned).toEqual(false)
  })
})
