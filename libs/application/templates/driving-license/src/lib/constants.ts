import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
  PREREQUISITES = 'prerequisites',
}

export const YES = 'yes'
export const NO = 'no'

type FakeCurrentLicense = 'none' | 'temp'
type YesOrNo = 'yes' | 'no'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  currentLicense?: FakeCurrentLicense
  healthRemarks?: YesOrNo
}
