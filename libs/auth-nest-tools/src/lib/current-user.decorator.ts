import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { logger } from '@island.is/logging'

import { getRequest } from './getRequest'
import { User } from './user'

export const getCurrentUser = (context: ExecutionContext): User => {
  const request = getRequest(context)

  const user = request.user
  if (!user) {
    logger.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  return user
}

export const CurrentUser = createParamDecorator(
  (options: unknown, context: ExecutionContext): User => {
    return getCurrentUser(context)
  },
)
