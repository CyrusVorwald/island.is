import { Test } from '@nestjs/testing'

import { DiscountService } from '../../discount.service'
import { Discount } from '../../discount.model'
import {
  PrivateDiscountController,
  PublicDiscountController,
} from '../../discount.controller'
import { NationalRegistryService } from '../../../nationalRegistry'
import { FlightService } from '../../../flight'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { UserService } from '../../../user/user.service'
import {
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'
import { CACHE_MANAGER } from '@nestjs/common'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { AirlineUser } from '../../../user/user.model'
import { createTestUser } from '../../../../../../test/createTestUser'

const auth: AuthUser = {
  nationalId: '1326487905',
  scope: ['@vegagerdin.is/air-discount-scheme-scope'],
  authorization: '',
  client: '',
}

describe('DiscountController', () => {
  let privateDiscountController: PrivateDiscountController
  let publicDiscountController: PublicDiscountController
  let discountService: DiscountService
  let nationalRegistryService: NationalRegistryService
  let userService: UserService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
        NationalRegistryClientModule,
      ],
      providers: [
        PrivateDiscountController,
        PublicDiscountController,
        UserService,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
          })),
        },
        {
          provide: DiscountService,
          useClass: jest.fn(() => ({
            getDiscountByNationalId: () => ({}),
            createDiscountCode: () => ({}),
            getDiscountByDiscountCode: () => ({}),
          })),
        },
        {
          provide: NationalRegistryService,
          useClass: jest.fn(() => ({
            getUser: () => ({}),
          })),
        },
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            countThisYearsConnectedFlightsByNationalId: () => 0,
            findThisYearsConnectableFlightsByNationalId: () => 0,
          })),
        },
      ],
    }).compile()

    publicDiscountController = moduleRef.get<PublicDiscountController>(
      PublicDiscountController,
    )
    privateDiscountController = moduleRef.get<PrivateDiscountController>(
      PrivateDiscountController,
    )
    discountService = moduleRef.get<DiscountService>(DiscountService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    userService = moduleRef.get<UserService>(UserService)
  })

  describe('getCurrentDiscountByNationalId', () => {
    it('should return discount', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const discount = new Discount(
        createTestUser(),
        discountCode,
        [],
        nationalId,
        0,
      )
      const getDiscountByNationalIdSpy = jest
        .spyOn(discountService, 'getDiscountByNationalId')
        .mockImplementation(() => Promise.resolve(discount))

      const result = await privateDiscountController.getCurrentDiscountByNationalId(
        { nationalId },
      )

      expect(getDiscountByNationalIdSpy).toHaveBeenCalledWith(nationalId)
      expect(result).toEqual(discount)
    })
  })

  describe('createDiscountCode', () => {
    it('should return discount', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const testUser = createTestUser()
      const discount = new Discount(testUser, discountCode, [], nationalId, 0)
      const createDiscountCodeSpy = jest
        .spyOn(discountService, 'createDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))
      const getUserInfoByNationalIdSpy = jest
        .spyOn(userService, 'getUserInfoByNationalId')
        .mockImplementation(() => Promise.resolve(testUser))

      const result = await privateDiscountController.createDiscountCode(
        {
          nationalId,
        },
        auth,
      )

      expect(getUserInfoByNationalIdSpy).toHaveBeenCalledWith(nationalId, auth)
      expect(createDiscountCodeSpy).toHaveBeenCalledWith(
        testUser,
        nationalId,
        0,
      )
      expect(result).toEqual(discount)
    })

    it('should throw an error because user is not found', async () => {
      const nationalId = '1234567890'
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))
      const createDiscountCodeSpy = jest.spyOn(
        discountService,
        'createDiscountCode',
      )

      try {
        await privateDiscountController.createDiscountCode(
          {
            nationalId,
          },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(getUserSpy).toHaveBeenCalledWith(nationalId, auth)
        expect(createDiscountCodeSpy).not.toHaveBeenCalled()
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `User<${nationalId}> not found`,
        })
      }
    })
  })

  describe('getUserByDiscountCode', () => {
    it('should return a user', async () => {
      const discountCode = 'ABCDEFG'
      const testUser = createTestUser()
      const airlineUser = new AirlineUser(testUser, testUser.fund)
      const nationalId = testUser.nationalId
      const discount = new Discount(testUser, discountCode, [], nationalId, 0)

      const getDiscountByDiscountCodeSpy = jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))

      const result = await publicDiscountController.getUserByDiscountCode({
        discountCode,
      })

      expect(getDiscountByDiscountCodeSpy).toHaveBeenCalledWith(discountCode)
      expect(result).toStrictEqual(airlineUser)
    })

    it('should return not found error when discount code does is invalid', async () => {
      const discountCode = 'ABCDEFG'

      jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicDiscountController.getUserByDiscountCode({ discountCode })
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: `Discount code is invalid`,
        })
      }
    })
  })
})
