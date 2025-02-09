import React, { ReactNode, useEffect, useState, useMemo } from 'react'
import { useWindowSize } from 'react-use'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { theme } from '@island.is/island-ui/theme'
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
  HeadWithSocialSharing,
  LiveChatIncChatPanel,
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
import MannaudstorgFooter from './Themes/MannaudstorgTheme/MannaudstorgFooter'
import { useNamespace } from '@island.is/web/hooks'
import { liveChatIncConfig, watsonConfig } from './config'
import { WatsonChatPanel } from '@island.is/web/components'
import LandlaeknirFooter from './Themes/LandlaeknirTheme/LandlaeknirFooter'
import { HeilbrigdisstofnunNordurlandsHeader } from './Themes/HeilbrigdisstofnunNordurlandsTheme/HeilbrigdisstofnunNordurlandsHeader'
import { LandlaeknirHeader } from './Themes/LandlaeknirTheme/LandlaeknirHeader'
import HeilbrigdisstofnunNordurlandsFooter from './Themes/HeilbrigdisstofnunNordurlandsTheme/HeilbrigdisstofnunNordurlandsFooter'
import { FiskistofaHeader } from './Themes/FiskistofaTheme/FiskistofaHeader'
import FiskistofaFooter from './Themes/FiskistofaTheme/FiskistofaFooter'
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

export const lightThemes = [
  'digital_iceland',
  'default',
  'landlaeknir',
  'fiskistofa',
]
export const footerEnabled = [
  'syslumenn',
  'district-commissioner',

  'utlendingastofnun',
  'directorate-of-immigration',

  'landlaeknir',
  'directorate-of-health',

  'sjukratryggingar',
  'icelandic-health-insurance',

  'mannaudstorg',

  'fiskistofa',
  'directorate-of-fisheries',
]

export const getThemeConfig = (
  theme: string,
  slug: string,
): { themeConfig: Partial<LayoutProps> } => {
  let footerVersion: LayoutProps['footerVersion'] = 'default'

  if (footerEnabled.includes(slug)) {
    footerVersion = 'organization'
  }

  if (theme === 'sjukratryggingar')
    return {
      themeConfig: {
        headerButtonColorScheme: 'blueberry',
        headerColorScheme: 'blueberry',
        footerVersion,
      },
    }

  const isLightTheme = lightThemes.includes(theme)
  return !isLightTheme
    ? {
        themeConfig: {
          headerColorScheme: 'white',
          headerButtonColorScheme: 'negative',
          footerVersion,
        },
      }
    : { themeConfig: { footerVersion } }
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
    case 'hsn':
      return (
        <HeilbrigdisstofnunNordurlandsHeader
          organizationPage={organizationPage}
        />
      )
    case 'landlaeknir':
      return <LandlaeknirHeader organizationPage={organizationPage} />
    case 'fiskistofa':
      return <FiskistofaHeader organizationPage={organizationPage} />
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

  const n = useNamespace(organization?.namespace ?? {})

  let OrganizationFooterComponent = null

  switch (organization?.slug) {
    case 'syslumenn':
    case 'district-commissioner':
      OrganizationFooterComponent = (
        <SyslumennFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
          questionsAndAnswersText={n(
            'questionsAndAnswers',
            'Spurningar og svör',
          )}
          canWeHelpText={n('canWeHelp', 'Getum við aðstoðað?')}
        />
      )
      break
    case 'sjukratryggingar':
    case 'icelandic-health-insurance':
      OrganizationFooterComponent = (
        <SjukratryggingarFooter footerItems={organization.footerItems} />
      )
      break
    case 'utlendingastofnun':
    case 'directorate-of-immigration':
      OrganizationFooterComponent = (
        <UtlendingastofnunFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'mannaudstorg':
      OrganizationFooterComponent = (
        <MannaudstorgFooter
          title={organization.title}
          logoSrc={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'landlaeknir':
    case 'directorate-of-health':
      OrganizationFooterComponent = (
        <LandlaeknirFooter footerItems={organization.footerItems} />
      )
      break
    case 'hsn':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunNordurlandsFooter
          footerItems={organization.footerItems}
        />
      )
      break
    case 'fiskistofa':
    case 'directorate-of-fisheries':
      OrganizationFooterComponent = (
        <FiskistofaFooter footerItems={organization.footerItems} />
      )
      break
  }

  return OrganizationFooterComponent
}

export const OrganizationChatPanel = ({
  organizationIds,
}: {
  organizationIds: string[]
  pushUp?: boolean
}) => {
  const organizationIdWithLiveChat = organizationIds.find((id) => {
    return id in liveChatIncConfig
  })

  if (organizationIdWithLiveChat) {
    return (
      <LiveChatIncChatPanel
        {...liveChatIncConfig[organizationIdWithLiveChat]}
      />
    )
  }

  const organizationIdWithWatson = organizationIds.find((id) => {
    return id in watsonConfig
  })

  if (organizationIdWithWatson) {
    return <WatsonChatPanel {...watsonConfig[organizationIdWithWatson]} />
  }

  return null
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
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | undefined>()

  useEffect(() => setIsMobile(width < theme.breakpoints.md), [width])

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
                  {organizationPage.secondaryMenu &&
                    secondaryNavList.length > 0 && (
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
                      image={
                        card.image?.url ||
                        'https://images.ctfassets.net/8k0h54kbe6bj/6jpT5mePCNk02nVrzVLzt2/6adca7c10cc927d25597452d59c2a873/bitmap.png'
                      }
                      size="small"
                    />
                  ))}
                </>
              )}
              {sidebarContent}
            </SidebarContainer>
          }
        >
          {isMobile && (
            <Box className={styles.menuStyle}>
              <Box marginY={2}>
                <Navigation
                  baseId="pageNavMobile"
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
                    baseId="secondaryNav"
                    colorScheme="purple"
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
          )}
          {(!!breadcrumbItems || !!pageDescription) && (
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
          )}
          {isMobile && sidebarContent}
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
      {!minimal && (
        <OrganizationFooter
          organizations={[organizationPage.organization]}
          force={true}
        />
      )}
      <OrganizationChatPanel
        organizationIds={[organizationPage?.organization?.id]}
      />
    </>
  )
}
