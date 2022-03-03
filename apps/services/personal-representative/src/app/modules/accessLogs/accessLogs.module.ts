import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  PersonalRepresentativeAccess,
  PersonalRepresentativeAccessService,
} from '@island.is/auth-api-lib/personal-representative'

import { AccessLogsController } from './accessLogs.controller'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeAccess])],
  controllers: [AccessLogsController],
  providers: [PersonalRepresentativeAccessService],
})
export class AccessLogsModule {}
