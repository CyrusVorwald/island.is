import {
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { Navigation } from 'react-native-navigation'
import { preferencesStore } from '../stores/preferences-store'
import { ComponentRegistry } from './component-registry'
import { getMainRoot } from './lifecycle/get-app-root'

export function isOnboarded() {
  const {
    hasOnboardedNotifications,
    hasOnboardedBiometrics,
    hasOnboardedPinCode,
  } = preferencesStore.getState()

  return (
    hasOnboardedBiometrics && hasOnboardedNotifications && hasOnboardedPinCode
  )
}

export async function getOnboardingScreens() {
  const {
    hasOnboardedNotifications,
    hasOnboardedBiometrics,
    hasOnboardedPinCode,
  } = preferencesStore.getState()
  const screens = []

  screens.push({
    component: {
      name: ComponentRegistry.OnboardingPinCodeScreen,
      id: 'ONBOARDING_PIN_CODE_SCREEN',
    },
  })

  // show set pin code screen
  if (!hasOnboardedPinCode) {
    return screens
  }

  const hasHardware = await hasHardwareAsync()
  const isEnrolled = await isEnrolledAsync()
  const supportedAuthenticationTypes = await supportedAuthenticationTypesAsync()

  if (hasHardware) {
    // biometrics screen
    screens.push({
      component: {
        name: ComponentRegistry.OnboardingBiometricsScreen,
        id: 'ONBOARDING_BIOMETRICS_SCREEN',
        passProps: {
          hasHardware,
          isEnrolled,
          supportedAuthenticationTypes,
        },
      },
    })

    // show enable biometrics screen
    if (!hasOnboardedBiometrics) {
      return screens
    }
  }

  screens.push({
    component: {
      name: ComponentRegistry.OnboardingNotificationsScreen,
      id: 'ONBOARDING_NOTIFICATIONS_SCREEN',
    },
  })

  // show notifications accept screen
  if (!hasOnboardedNotifications) {
    return screens
  }

  return []
}

export async function nextOnboardingStep() {
  const screens = await getOnboardingScreens()

  if (screens.length === 0) {
    Navigation.setRoot({ root: getMainRoot() })
    return
  }

  if (screens.length === 1) {
    Navigation.push('LOGIN_SCREEN', screens[0])
    return
  }

  const [currentScreen, nextScreen] = screens.slice(-2)
  Navigation.push(currentScreen.component.id, nextScreen)
}
