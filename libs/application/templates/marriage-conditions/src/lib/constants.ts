import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  APPLICANT_DONE = 'applicant_done',
  SPOUSE_CONFIRMED = 'spouse_confirmed',
  WITNESS_ONE_CONFIRMED = 'witness_one_confirmed',
  WITNESS_TWO_CONFIRMED = 'witness_two_confirmed',
  COMPLETE = 'complete',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNED_SPOUSE = 'assigned_spouse',
}

export const YES = 'yes'
export const NO = 'no'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}
