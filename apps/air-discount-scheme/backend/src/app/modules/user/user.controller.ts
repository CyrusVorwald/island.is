import {
  Controller,
  Param,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

import { GetUserRelationsParams } from './dto'
import { UserService } from './user.service'
import { User } from './user.model'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@vegagerdin.is/air-discount-scheme-scope')
@Controller('api/private')
export class PrivateUserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint()
  async getUserRelations(
    @Param() params: GetUserRelationsParams,
    @CurrentUser() authUser: AuthUser,
  ): Promise<User[]> {
    if (params.nationalId !== authUser.nationalId) {
      throw new BadRequestException(
        '[/relations] Request parameters do not correspond with user authentication.',
      )
    }
    console.log('AM INSIDE RELATIONS CALL')
    console.log('PARAMS', params)
    console.log('AUTHUSER', authUser)
    const relations = [
      authUser.nationalId,
      ...(await this.userService.getRelations(authUser)),
    ]

    console.log('RELATIONS BABY', relations)

    const userAndRelatives = await this.userService.getMultipleUsersByNationalIdArray(
      relations,
      authUser,
    )

    console.log('USER AND RELATIVES BOYYYYY', userAndRelatives)

    return userAndRelatives
  }
}
