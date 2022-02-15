import React, { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import getConfig from 'next/config'
import { LayoutProps } from '@island.is/web/layouts/main'
import {
  Image,
  Organization,
  OrganizationPage,
} from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  ProfileCard,
  Stack,
  Text,
  Button,
  Inline,
} from '@island.is/island-ui/core'
import {
  ChatPanel,
  HeadWithSocialSharing,
  Main,
  Sticky,
} from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SyslumennHeader, SyslumennFooter } from './Themes/SyslumennTheme'
import {
  SjukratryggingarHeader,
  SjukratryggingarFooter,
} from './Themes/SjukratryggingarTheme'
import { DigitalIcelandHeader } from './Themes/DigitalIcelandTheme'
import { DefaultHeader } from './Themes/DefaultTheme'
import {
  UtlendingastofnunFooter,
  UtlendingastofnunHeader,
} from './Themes/UtlendingastofnunTheme'
import { endpoints as chatPanelEndpoints } from '../../ChatPanel/config'
import { OrganizationAlert } from '../OrganizationAlert/OrganizationAlert'

import * as styles from './OrganizationWrapper.css'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
  stickySidebar?: boolean
  minimal?: boolean
  showSecondaryMenu?: boolean
  showExternalLinks?: boolean
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const lightThemes = ['digital_iceland', 'utlendingastofnun']
export const footerEnabled = ['syslumenn']

export const getThemeConfig = (
  theme: string,
): { themeConfig: Partial<LayoutProps> } => {
  if (theme === 'sjukratryggingar')
    return {
      themeConfig: {
        headerButtonColorScheme: 'blueberry',
        headerColorScheme: 'blueberry',
      },
    }

  const isLightTheme = lightThemes.includes(theme)
  return !isLightTheme
    ? {
        themeConfig: {
          headerColorScheme: 'white',
          headerButtonColorScheme: 'negative',
        },
      }
    : { themeConfig: {} }
}

const OrganizationHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennHeader organizationPage={organizationPage} />
    case 'sjukratryggingar':
      return <SjukratryggingarHeader organizationPage={organizationPage} />
    case 'utlendingastofnun':
      return <UtlendingastofnunHeader organizationPage={organizationPage} />
    case 'digital_iceland':
      return <DigitalIcelandHeader organizationPage={organizationPage} />
    default:
      return <DefaultHeader organizationPage={organizationPage} />
  }
}

interface ExternalLinksProps {
  organizationPage: OrganizationPage
}

export const OrganizationExternalLinks: React.FC<ExternalLinksProps> = ({
  organizationPage,
}) => {
  if (organizationPage.externalLinks) {
    return (
      <Box
        display={['none', 'none', 'flex', 'flex']}
        justifyContent="flexEnd"
        marginBottom={4}
      >
        <Inline space={2}>
          {organizationPage.externalLinks.map((link, index) => (
            <Link href={link.url} key={'organization-external-link-' + index}>
              <Button
                colorScheme="light"
                icon="open"
                iconType="outline"
                size="small"
              >
                {link.text}
              </Button>
            </Link>
          ))}
        </Inline>
      </Box>
    )
  }
  return null
}

interface FooterProps {
  organizations: Array<Organization>
  force?: boolean
}

export const OrganizationFooter: React.FC<FooterProps> = ({
  organizations,
  force = false,
}) => {
  const organization = force
    ? organizations[0]
    : organizations.find((x) => footerEnabled.includes(x.slug))
  if (!organization) return null

  switch (organization.slug) {
    case 'syslumenn':
      return (
        <SyslumennFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
    case 'sjukratryggingar':
      return (
        <SjukratryggingarFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
    case 'utlendingastofnun':
      return (
        <UtlendingastofnunFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
  }
  return null
}

export const OrganizationChatPanel = ({
  slugs,
  pushUp = false,
}: {
  slugs: string[]
  pushUp?: boolean
}) => {
  // remove when organization chat-bot is ready for release
  const { publicRuntimeConfig } = getConfig()
  const { disableOrganizationChatbot } = publicRuntimeConfig
  if (disableOrganizationChatbot === 'true') {
    return null
  }

  const chatEnabled = ['syslumenn']

  const slug = slugs.find((x) => chatEnabled.includes(x))

  return slug ? (
    <ChatPanel
      endpoint={slug as keyof typeof chatPanelEndpoints}
      pushUp={pushUp}
    />
  ) : null
}

const SecondaryMenu = ({
  title,
  items,
}: {
  title: string
  items: NavigationItem[]
}) => (
  <Box
    background="purple100"
    borderRadius="large"
    padding={[3, 3, 4]}
    marginY={3}
  >
    <Stack space={[1, 1, 2]}>
      <Text variant="eyebrow" as="h2">
        {title}
      </Text>
      {items.map((link) => (
        <Link key={link.href} href={link.href} underline="normal">
          <Text
            key={link.href}
            as="span"
            variant={link.active ? 'h5' : 'default'}
          >
            {link.title}
          </Text>
        </Link>
      ))}
    </Stack>
  </Box>
)

const getActiveNavigationItemTitle = (
  navigationItems: NavigationItem[],
  clientUrl: string,
) => {
  for (const item of navigationItems) {
    if (clientUrl === item.href) {
      return item.title
    }
    for (const childItem of item.items) {
      if (clientUrl === childItem.href) {
        return childItem.title
      }
    }
  }
}

export const OrganizationWrapper: React.FC<WrapperProps> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems,
  mainContent,
  sidebarContent,
  navigationData,
  fullWidthContent = false,
  stickySidebar = true,
  children,
  minimal = false,
  showSecondaryMenu = true,
  showExternalLinks = false,
}) => {
  const router = useRouter()

  const secondaryNavList: NavigationItem[] =
    organizationPage.secondaryMenu?.childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: router.asPath === url,
    })) ?? []

  const activeNavigationItemTitle = useMemo(
    () => getActiveNavigationItemTitle(navigationData.items, router.asPath),
    [navigationData.items, router.asPath],
  )

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

  const SidebarContainer = stickySidebar ? Sticky : Box

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageContentType={pageFeaturedImage?.contentType}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <OrganizationHeader organizationPage={organizationPage} />
      <Main>
        {organizationPage.alertBanner && (
          <OrganizationAlert
            alertBanner={organizationPage.alertBanner}
            centered={true}
            marginTop={10}
          />
        )}
        {!minimal && (
          <SidebarLayout
            paddingTop={[2, 2, 9]}
            paddingBottom={[4, 4, 4]}
            isSticky={false}
            fullWidthContent={fullWidthContent}
            sidebarContent={
              <SidebarContainer>
                <Navigation
                  baseId="pageNav"
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={activeNavigationItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
                {showSecondaryMenu && (
                  <>
                    {organizationPage.secondaryMenu && (
                      <SecondaryMenu
                        title={organizationPage.secondaryMenu.name}
                        items={secondaryNavList}
                      />
                    )}
                    {organizationPage.sidebarCards.map((card) => (
                      <ProfileCard
                        title={card.title}
                        description={card.content}
                        link={card.link}
                        image="https://images.ctfassets.net/8k0h54kbe6bj/6jpT5mePCNk02nVrzVLzt2/6adca7c10cc927d25597452d59c2a873/bitmap.png"
                        size="small"
                      />
                    ))}
                  </>
                )}
                {sidebarContent}
              </SidebarContainer>
            }
          >
            <Hidden above="sm">
              <Box className={styles.menuStyle}>
                <Box marginY={2}>
                  <Navigation
                    baseId="pageNav"
                    isMenuDialog={true}
                    items={navigationData.items}
                    title={navigationData.title}
                    activeItemTitle={activeNavigationItemTitle}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href}>{link}</NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                </Box>
                {organizationPage.secondaryMenu && (
                  <Box marginY={2}>
                    <Navigation
                      colorScheme="purple"
                      baseId="secondarynav"
                      isMenuDialog={true}
                      title={organizationPage.secondaryMenu.name}
                      items={secondaryNavList}
                      renderLink={(link, item) => {
                        return item?.href ? (
                          <NextLink href={item?.href}>{link}</NextLink>
                        ) : (
                          link
                        )
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Hidden>
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={fullWidthContent ? ['9/9', '9/9', '7/9'] : '9/9'}
                  offset={fullWidthContent ? ['0', '0', '1/9'] : '0'}
                >
                  {breadcrumbItems && (
                    <Breadcrumbs
                      items={breadcrumbItems ?? []}
                      renderLink={(link, item) => {
                        return item?.href ? (
                          <NextLink href={item?.href}>{link}</NextLink>
                        ) : (
                          link
                        )
                      }}
                    />
                  )}
                  {showExternalLinks && (
                    <OrganizationExternalLinks
                      organizationPage={organizationPage}
                    />
                  )}

                  {pageDescription && (
                    <Box paddingTop={[2, 2, breadcrumbItems ? 5 : 0]}>
                      <Text variant="default">{pageDescription}</Text>
                    </Box>
                  )}
                </GridColumn>
              </GridRow>
            </GridContainer>
            <Hidden above="sm">{sidebarContent}</Hidden>
            <Box paddingTop={fullWidthContent ? 0 : 4}>
              {mainContent ?? children}
            </Box>
          </SidebarLayout>
        )}
        {!!mainContent && children}
        {minimal && (
          <GridContainer>
            <GridRow>
              <GridColumn
                paddingTop={6}
                span={['12/12', '12/12', '10/12']}
                offset={['0', '0', '1/12']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </Main>
      {!minimal && (
        <OrganizationFooter
          organizations={[organizationPage.organization]}
          force={true}
        />
      )}
      <OrganizationChatPanel slugs={[organizationPage?.slug]} />
    </>
  )
}
