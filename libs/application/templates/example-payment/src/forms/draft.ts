import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildRadioField,
  buildSubmitField,
  DefaultEvents,
} from '@island.is/application/core'
import {
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'
import { chargeItemCodeRadioOptions } from '../lib/utils/chargeItemCodeRadioOptions'

export const draft: Form = buildForm({
  id: 'ExamplePaymentDraftForm',
  title: m.m.applicationTitle,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.step.externalDataTitle,
      children: [
        buildExternalDataProvider({
          title: m.draft.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.draft.externalDataTitle,
          checkboxLabel: m.draft.externalDataTitle,
          dataProviders: [
            buildDataProviderItem({
              id: 'feeInfo',
              type: 'FeeInfoProvider',
              title: m.draft.feeInfo,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: m.step.info,
      children: [
        buildMultiField({
          id: 'info',
          title: m.draft.informationTitle,
          space: 1,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.m.payUp,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.m.payUp,
                  type: 'primary',
                },
              ],
            }),
            buildRadioField({
              id: 'userSelectedChargeItemCode',
              title: m.draft.selectFieldTitle,
              options: chargeItemCodeRadioOptions,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.step.paymentTitle,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: m.step.confirmTitle,
      children: [],
    }),
  ],
})
