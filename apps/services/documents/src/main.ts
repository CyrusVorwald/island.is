import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments/'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'services-documents',
  openApi,
  port: environment.port,
})
