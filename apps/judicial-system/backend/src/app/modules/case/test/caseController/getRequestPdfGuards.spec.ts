import { CanActivate } from '@nestjs/common'

import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseController } from '../../case.controller'

describe('CaseController - Get request pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.getRequestPdf,
    )
  })

  it('should have four guards', () => {
    expect(guards).toHaveLength(4)
  })

  describe('JwtAuthGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(JwtAuthGuard)
    })
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseExistsGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseReadGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseReadGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseReadGuard)
    })
  })
})
