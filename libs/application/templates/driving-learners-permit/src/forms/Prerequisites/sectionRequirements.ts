import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const sectionRequirements = buildSubSection({
  id: 'requirements',
  title: m.applicationEligibilityTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.eligibilityRequirementTitle,
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'EligibilitySummary',
          id: 'eligsummary',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'Lorem ipsum',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Dolor sit amet',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
