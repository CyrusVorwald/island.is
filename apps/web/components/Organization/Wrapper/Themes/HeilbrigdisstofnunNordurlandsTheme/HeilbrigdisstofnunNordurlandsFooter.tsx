import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Hyphen,
  Inline,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'
import * as styles from './HeilbrigdisstofnunNordurlandsFooter.css'
import { SpanType } from '@island.is/island-ui/core/types'

interface HeilbrigdisstofnunNordurlandsFooterProps {
  footerItems: FooterItem[]
}

export const HeilbrigdisstofnunNordurlandsFooter = ({
  footerItems,
}: HeilbrigdisstofnunNordurlandsFooterProps) => {
  const renderColumn = (
    column: FooterItem[],
    span: SpanType = ['4/8', '2/8', '1/8'],
    offset = false,
  ) => {
    if (column.length <= 0) return null
    return (
      <GridColumn span={span}>
        {column.map((item, index) => (
          <Box
            key={`${item.id}-${index}`}
            className={styles.locationBox}
            marginLeft={offset ? [0, 0, 0, 10] : 0}
          >
            <Text fontWeight="semiBold" color="white" marginBottom={1}>
              <Hyphen>{item.title}</Hyphen>
            </Text>
            {richText(item.content as SliceType[], {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (_node, children) => (
                  <Text
                    color="white"
                    variant="eyebrow"
                    fontWeight="regular"
                    lineHeight="xl"
                    marginBottom={2}
                  >
                    {children}
                  </Text>
                ),
              },
            })}
          </Box>
        ))}
      </GridColumn>
    )
  }

  return (
    <footer aria-labelledby="heilbrigdisstofnun-nordurlands-footer">
      <Box className={styles.container}>
        <GridContainer>
          <GridColumn className={styles.mainColumn}>
            <GridRow>
              <img
                src="https://images.ctfassets.net/8k0h54kbe6bj/rXPqjnjJYePJHhHvO0UDT/b5aaf2e6dc54abb4b1dc2bd8065217b7/HSN_landscape_hvittGratt.png?h=250"
                alt="heilbrigdisstofnun-nordurlands-logo"
                width={590}
              />
            </GridRow>

            <GridRow className={styles.line}>
              {renderColumn([footerItems[0]], ['8/8', '4/8', '2/8'], true)}
              {renderColumn(footerItems.slice(1, 4))}
              {renderColumn(footerItems.slice(4, 7))}
              {renderColumn(footerItems.slice(7, 10))}
              {renderColumn(footerItems.slice(10, 13))}
              {renderColumn(footerItems.slice(13, 16), ['8/8', '4/8', '2/8'])}
            </GridRow>

            <GridRow align="flexEnd" marginTop={3}>
              <Box marginRight={[4, 4, 12]}>
                <Inline alignY="center" align="center" space={5}>
                  <img
                    src="https://images.ctfassets.net/8k0h54kbe6bj/1igNLuoV9IQAwP1A4bfyXd/0d96a9a057e48b28616832552838c7a5/hsn-jafnlaunavottun.svg"
                    alt="jafnlaunavottun"
                    width={50}
                  />
                  <img
                    src="https://images.ctfassets.net/8k0h54kbe6bj/2QMl8Mw50Vj0AjlI6jzENH/cc4792e02ff1b152ede7e892da333669/greenSteps.png"
                    alt="graen-skref"
                    width={90}
                  />
                </Inline>
              </Box>
            </GridRow>
          </GridColumn>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default HeilbrigdisstofnunNordurlandsFooter
