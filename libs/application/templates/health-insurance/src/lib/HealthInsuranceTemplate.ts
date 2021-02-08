import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
} from '@island.is/application/core'
import * as z from 'zod'
import { NO, YES } from '../constants'
import { StatusTypes } from '../types'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }
  | { type: 'MISSING_INFO' }

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string(),
})

const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  confirmationOfResidencyDocument: z.array(FileSchema).nonempty(),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().min(3).max(3),
    city: z.string().nonempty(),
    nationality: z.string().nonempty(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
  }),
  status: z.enum([
    StatusTypes.EMPLOYED,
    StatusTypes.STUDENT,
    StatusTypes.PENSIONER,
    StatusTypes.OTHER,
  ]),
  confirmationOfStudies: z.array(FileSchema).nonempty(),
  children: z.string().nonempty(),
  formerInsurance: z.object({
    country: z.string().nonempty(),
    registration: z.string().nonempty(),
    personalId: z.string().nonempty(),
    institution: z.string(),
    entitlement: z.enum([YES, NO]),
    entitlementReason: z.string().nonempty(),
  }),
  additionalInfo: z.object({
    hasAdditionalInfo: z.enum([YES, NO]),
    files: z.array(FileSchema),
    remarks: z.string(),
  }),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: 'Application for health insurance',
  dataSchema: HealthInsuranceSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Application for health insurance',
          progress: 0.25,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'inReview',
          },
        },
      },
      inReview: {
        meta: {
          name: 'In Review',
          progress: 0.5,
          roles: [
            {
              id: 'reviewer',
              formLoader: () =>
                import('../forms/ConfirmationScreen').then((val) =>
                  Promise.resolve(val.HealthInsuranceConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    if (application.state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default HealthInsuranceTemplate
