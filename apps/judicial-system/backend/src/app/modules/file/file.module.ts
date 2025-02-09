import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule, CourtModule, AwsS3Module } from '../index'
import { CaseFile } from './models/file.model'
import { FileService } from './file.service'
import { FileController } from './file.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    SequelizeModule.forFeature([CaseFile]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
