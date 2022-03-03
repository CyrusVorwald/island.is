import {
  buildCustomField,
  buildForm,
  Form,
  FormModes,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { m } from '../lib/messages'

export const PetitionApplicationApproved: Form = buildForm({
  id: 'PetitionApplicationApproved',
  title: m.overview.finalTitle,
  logo: Logo,
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'thankYou',
      title: m.overview.finalTitle,
      component: 'ListSubmitted',
    }),
  ],
})
