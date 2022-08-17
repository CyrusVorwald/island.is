import { Module } from '@nestjs/common'
import { FirearmLicenseApiProvider } from './firearmLicenseApiProvider'

@Module({
  providers: [FirearmLicenseApiProvider],
  exports: [FirearmLicenseApiProvider],
})
export class FirearmLicenseClientModule {}
