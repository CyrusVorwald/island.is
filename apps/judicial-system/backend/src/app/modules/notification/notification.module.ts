import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import { environment } from '../../../environments'
import { CaseModule, CourtModule, EventModule,UserModule } from '../index'

import { Notification } from './models/notification.model'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    CmsTranslationsModule,
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => CourtModule),
    forwardRef(() => EventModule),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
