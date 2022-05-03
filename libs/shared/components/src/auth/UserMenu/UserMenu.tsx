import React, { useEffect, useState } from 'react'
import { Box, Hidden } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserButton } from './UserButton'
import { UserDropdown } from './UserDropdown'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'

import MagicBell, {
  FloatingNotificationInbox,
} from '@magicbell/magicbell-react'

export const Notifications = ({
  userExternalId,
}: {
  userExternalId: string
}) => {
  const theme = {
    icon: { borderColor: '#0061ff', width: '24px' },
    unseenBadge: { backgroundColor: '#DF4759' },
    header: {
      backgroundColor: '#0061ff',
      textColor: '#ffffff',
      borderRadius: '16px',
    },
    footer: {
      backgroundColor: '#0061ff',
      textColor: '#ffffff',
      borderRadius: '16px',
    },
    notification: {
      default: {
        textColor: '#15091F',
        borderRadius: '8px',
        backgroundColor: '#0061ff',
      },
      unseen: {
        backgroundColor: '#0061ff',
        textColor: '#15091F',
        borderRadius: '8px',
      },
      unread: {
        backgroundColor: '#0061ff',
        textColor: '#15091F',
        borderRadius: '8px',
      },
    },
  }
  const magicBellApiKey = 'cdd9891950d1aa151ca687c13469e2043db818ec'
  return (
    <MagicBell
      apiKey={magicBellApiKey}
      userExternalId={userExternalId}
      theme={theme}
    >
      {(props) => <FloatingNotificationInbox height={500} {...props} />}
    </MagicBell>
  )
}

export const UserMenu = ({
  fullscreen = false,
  showDropdownLanguage = false,
  userMenuOpen,
  small = false,
  setUserMenuOpen,
}: {
  fullscreen?: boolean
  small?: boolean
  showDropdownLanguage?: boolean
  setUserMenuOpen?: (state: boolean) => void
  userMenuOpen?: boolean
}) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )
  const { signOut, switchUser, userInfo: user } = useAuth()

  const handleClick = () => {
    setDropdownState(dropdownState === 'open' ? 'closed' : 'open')
  }
  useEffect(() => {
    setUserMenuOpen && setUserMenuOpen(dropdownState === 'open')
  }, [dropdownState])

  useEffect(() => {
    if (dropdownState === 'open' && !userMenuOpen) {
      setDropdownState('closed')
    }
  }, [userMenuOpen])

  if (!user) {
    return null
  }

  return (
    <Box display="flex" position="relative" height="full">
      <Notifications userExternalId={user.profile.nationalId}></Notifications>
      <Hidden below="md">
        <UserLanguageSwitcher user={user} />
      </Hidden>
      <UserButton user={user} onClick={handleClick} small={small} />
      <UserDropdown
        user={user}
        dropdownState={dropdownState}
        setDropdownState={setDropdownState}
        onLogout={() => {
          setDropdownState('closed')
          signOut()
        }}
        onSwitchUser={(nationalId: string) => {
          setDropdownState('closed')
          switchUser(nationalId)
        }}
        fullscreen={fullscreen}
        showDropdownLanguage={showDropdownLanguage}
      />
    </Box>
  )
}
