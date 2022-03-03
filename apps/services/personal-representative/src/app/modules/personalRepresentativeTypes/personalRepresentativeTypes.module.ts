import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  PersonalRepresentativeType,
  PersonalRepresentativeTypeService,
} from '@island.is/auth-api-lib/personal-representative'

import { PersonalRepresentativeTypesController } from './personalRepresentativeTypes.controller'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeType])],
  controllers: [PersonalRepresentativeTypesController],
  providers: [PersonalRepresentativeTypeService],
})
export class PersonalRepresentativeTypesModule {}
