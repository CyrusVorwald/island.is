import { DynamicModule, Module } from '@nestjs/common'

import {
  PaymentScheduleAPI,
  PaymentScheduleServiceOptions,
} from '@island.is/clients/payment-schedule'
import { PaymentScheduleClientModule } from '@island.is/clients/payment-schedule'

import { PaymentScheduleResolver } from './graphql/payment-schedule.resolver'
import { PaymentScheduleService } from './payment-schedule.service'

@Module({})
export class PaymentScheduleModule {
  static register(config: PaymentScheduleServiceOptions): DynamicModule {
    return {
      module: PaymentScheduleModule,
      imports: [PaymentScheduleClientModule.register(config)],
      providers: [PaymentScheduleResolver, PaymentScheduleService],
    }
  }
}
