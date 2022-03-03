import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const UserProfileClientConfig = defineConfig({
  name: 'UserProfileApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'USER_PROFILE_CLIENT_URL',
        'http://localhost:3366',
      ),
    }
  },
})
