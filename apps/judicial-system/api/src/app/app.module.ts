import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { courtClientModuleConfig } from '@island.is/judicial-system/court-client'
import { ConfigModule } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'

import { BackendApi } from './data-sources/backend'
import {
  AuthModule,
  CaseModule,
  DefendantModule,
  FeatureModule,
  FileModule,
  InstitutionModule,
  PoliceModule,
  UserModule,
} from './modules'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/judicial-system/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
      dataSources: () => ({ backendApi: new BackendApi() }),
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    AuditTrailModule.register(environment.auditTrail),
    AuthModule,
    UserModule,
    CaseModule,
    DefendantModule,
    FileModule,
    InstitutionModule,
    FeatureModule,
    CmsTranslationsModule,
    PoliceModule,
    ProblemModule.forRoot({ logAllErrors: true }),
  ],
})
export class AppModule {}
