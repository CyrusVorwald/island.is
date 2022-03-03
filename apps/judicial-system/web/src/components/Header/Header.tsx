import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Box, Button,Logo, Text } from '@island.is/island-ui/core'
import * as Constants from '@island.is/judicial-system/consts'
import { UserRole } from '@island.is/judicial-system/types'
import { api } from '@island.is/judicial-system-web/src/services'

import { UserContext } from '../UserProvider/UserProvider'

import * as styles from './Header.css'

const Header: React.FC = () => {
  const router = useRouter()
  const { isAuthenticated, user } = useContext(UserContext)

  return (
    <header className={styles.header}>
      <Link
        href={
          !user || !isAuthenticated
            ? '/'
            : user.role === UserRole.ADMIN
            ? Constants.USER_LIST_ROUTE
            : Constants.REQUEST_LIST_ROUTE
        }
        data-testid="link-to-home"
      >
        <Box display="flex" alignItems="center" cursor="pointer">
          <Logo width={146} />
          {router.pathname !== '/' && (
            <>
              {/* Text does not allow className prop so we need to do this on a separate span */}
              <span className={styles.headerDiviter} />
              <span className={styles.headerTextWrapper}>
                <Text>Réttarvörslugátt</Text>
              </span>
            </>
          )}
        </Box>
      </Link>
      {isAuthenticated && (
        <Button
          variant="ghost"
          icon="logOut"
          iconType="outline"
          size="small"
          onClick={async () => {
            await api.logout()
            window.location.assign('/')
          }}
          data-testid="logout-button"
        >
          {user?.name}
        </Button>
      )}
    </header>
  )
}

export default Header
