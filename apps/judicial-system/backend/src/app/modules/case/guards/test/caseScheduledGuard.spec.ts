import each from 'jest-each'

import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseState } from '@island.is/judicial-system/types'

import { CaseScheduledGuard } from '../caseScheduled.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Case Scheduled Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new CaseScheduledGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  each`
    state
    ${CaseState.ACCEPTED}
    ${CaseState.REJECTED}
    ${CaseState.DISMISSED}
  `.describe('completed case', ({ state }) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { state } }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('scheduled case', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: { state: CaseState.RECEIVED, courtDate: new Date() },
      }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  each`
    state
    ${CaseState.NEW}
    ${CaseState.DRAFT}
    ${CaseState.SUBMITTED}
    ${CaseState.RECEIVED}
    ${CaseState.DELETED}
  `.describe('unscheduled case', ({ state }) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { state } }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe('Forbidden for unscheduled cases')
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
