import NextAuth, { CallbacksOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { uuid } from 'uuidv4'
import { identityServerConfig } from '@island.is/air-discount-scheme-web/lib'
import {
  AuthUser,
  signIn as handleSignIn,
  jwt as handleJwt,
  session as handleSession,
  AuthSession,
} from '@island.is/next-ids-auth'
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils'
import { JWT } from 'next-auth/jwt'
import { decode } from 'jsonwebtoken'
import { useSession } from 'next-auth/client'

const providers = [
  Providers.IdentityServer4({
    id: identityServerConfig.id,
    name: identityServerConfig.name,
    scope: identityServerConfig.scope,
    clientId: identityServerConfig.clientId,
    domain: process.env.IDENTITY_SERVER_DOMAIN ?? '@island.is',
    clientSecret: process.env.IDENTITY_SERVER_SECRET,
    protection: 'pkce',
  }),
]

const callbacks: CallbacksOptions = {
  signIn: signIn,
  jwt: jwt,
  session: sessionFunc,
}


async function signIn(
  user: AuthUser,
  account: Record<string, unknown>,
  profile: Record<string, unknown>,
): Promise<boolean> {
  console.log('pre sign in')
  return handleSignIn(user, account, profile, identityServerConfig.id)
}

async function jwt(token: JWT, user: AuthUser) {
  console.log('my token: ' + token)
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
      folder: token.folder ?? uuid(),
      service: 'Loftbru',
    }
  }
  return await handleJwt(
    token,
    identityServerConfig.clientId,
    process.env.IDENTITY_SERVER_SECRET,
    process.env.NEXTAUTH_URL ?? 'http://localhost:4200/api/auth',
    process.env.IDENTITY_SERVER_DOMAIN ?? '@vegagerdin.is',
  )
}

async function sessionFunc(session: AuthSession, user: AuthUser) {
  // if(session=undefined) {
  //   session = useSession()
  // }
  console.log('[nextauth] session ' + session)
  session.accessToken = user.accessToken
  session.idToken = user.idToken
  const decoded = decode(session.accessToken)
  console.log(decoded)
  console.log('session access token ' + session.accessToken)
  if (
    decoded &&
    !(typeof decoded === 'string') &&
    decoded['exp'] &&
    decoded['scope']
  ) {
    session.expires = JSON.stringify(new Date(decoded.exp * 1000))
    session.scope = decoded.scope
  }

  return session
}

const options = { providers, callbacks, session: {jwt: true} }

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('look at me')
  console.log('next auth req, ', { req })
  NextAuth(req, res, options)
}