import { useLocale, useNamespaces, isLocale } from '@island.is/localization'
import { useEffect } from 'react'
import { useAuth } from '@island.is/auth/react'
import { useGetUserProfileLocaleLazyQuery } from '../../../gen/graphql'

/**
 * If the user has set a preferred language in his user
 * profile that is not the default language on startup,
 * set the current language to that one.
 * Note: This is a temporary solution, the preferred
 * language should be fetched by the auth server and returned
 * with the userInfo token in the future.
 */
export const UserProfileLocale = () => {
  const { changeLanguage } = useNamespaces()
  const { lang } = useLocale()
  const { userInfo } = useAuth()
  const [getUserProfile, { data }] = useGetUserProfileLocaleLazyQuery()

  const userProfile = data?.getUserProfile || null

  useEffect(() => {
    if (userInfo?.profile.nationalId) getUserProfile()
  }, [userInfo, getUserProfile])

  useEffect(() => {
    if (
      userProfile &&
      userProfile.locale &&
      isLocale(userProfile.locale) &&
      userProfile.locale !== lang
    )
      changeLanguage(userProfile.locale)
  }, [userProfile])

  return null
}
