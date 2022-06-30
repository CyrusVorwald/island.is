import {
  ApplicationTypes,
  buildCustomField,
  buildForm,
  buildMultiField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'
export const Rejected: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.rejectedTitle,
  mode: FormModes.REJECTED,
  children: [
    buildMultiField({
      id: 'rejected',
      title: m.rejectedTitle,
      description: m.rejectedSubTitle,
      children: [
        buildCustomField({
          id: 'RejectionScreen',
          title: 'RejectionScreen',
          component: 'RejectionScreen',
        }),
        buildCustomField({
          id: 'ManOnBench',
          title: 'ManOnBench',
          component: 'ManOnBenchIllustrationPeriods',
        }),
      ],
    }),
  ],
})
