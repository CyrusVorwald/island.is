import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const done: Form = buildForm({
  id: 'spouse_done',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'congrats',
      component: 'Congratulations',
      title: 'Umsókn móttekin',
    }),
  ],
})
