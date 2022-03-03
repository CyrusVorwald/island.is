import { Inject, Injectable } from '@nestjs/common'

import type { Auth } from '@island.is/auth-nest-tools'
import {
  AuthMiddleware,
  AuthMiddlewareOptions,
} from '@island.is/auth-nest-tools'
import type { EinstaklingarGetEinstaklingurRequest } from '@island.is/clients/national-registry-v2'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { IndividuaInfoDTO } from '../entities/dto/individual-info.dto'

@Injectable()
export class UserProfileService {
  constructor(
    @Inject(EinstaklingarApi)
    private individualApi: EinstaklingarApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findIndividual(
    auth: Auth,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ): Promise<IndividuaInfoDTO> {
    try {
      const result = await this.individualApi
        .withMiddleware(new AuthMiddleware(auth, authMiddlewareOptions))
        .einstaklingarGetEinstaklingur(<EinstaklingarGetEinstaklingurRequest>{
          id: auth.nationalId,
        })

      return { name: result.nafn }
    } catch (error) {
      this.logger.error('Error in findIndividual', error)
      throw error
    }
  }
}
