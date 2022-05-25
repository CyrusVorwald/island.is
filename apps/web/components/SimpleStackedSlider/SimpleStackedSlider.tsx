import React, { FC, Children, useRef, useState } from 'react'
import cn from 'classnames'
import chunk from 'lodash/chunk'

import {
  Box,
  GridColumn,
  GridColumnProps,
  GridRow,
  Hidden,
  Inline,
} from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/web/components'

import * as styles from './SimpleStackedSlider.css'

type Levels = number | 'auto'

interface SimpleStackedSliderProps {
  span?: GridColumnProps['span']
  levels?: Levels
  itemWidth?: number
}

export const SimpleStackedSlider: FC<SimpleStackedSliderProps> = ({
  children,
  levels = 'auto',
  itemWidth = 400,
  span = '4/12',
}) => {
  const [activeDot, setActiveDot] = useState(0)
  const scrollRef = useRef(null)
  const itemRef = useRef(null)

  const items = Children.toArray(children)

  if (!items?.length) {
    return null
  }

  const l =
    levels === 'auto' || !(levels > 0) ? Math.ceil(items.length / 6) : levels

  const chunks = chunk(items, Math.ceil(items.length / l))
  const rowLength = chunks[0].length

  const renderedItems = (
    <GridContainer>
      <GridRow>
        {items.map((item, index) => {
          return (
            <GridColumn key={index} span={span} paddingBottom={3}>
              {item}
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )

  if (items.length <= levels) {
    return renderedItems
  }

  return (
    <>
      <Hidden below="sm">{renderedItems}</Hidden>

      <Hidden above="xs">
        <Box ref={scrollRef} className={styles.outer}>
          <GridContainer>
            <Box className={styles.inner}>
              {chunks.map((chunk, chunkIndex) => {
                return (
                  <Box key={`chunk-${chunkIndex}`} className={styles.row}>
                    {chunk.map((item, index) => {
                      const firstItem = chunkIndex === 0 && index === 0

                      return (
                        <Box
                          {...(firstItem && { ref: itemRef })}
                          key={`item-${index}`}
                          paddingBottom={3}
                          className={styles.column}
                          style={{
                            width: itemWidth,
                          }}
                        >
                          {item}
                        </Box>
                      )
                    })}
                  </Box>
                )
              })}
            </Box>
          </GridContainer>
        </Box>

        <GridContainer>
          <Box display="flex" justifyContent="flexEnd">
            <Inline space={2}>
              {[...Array(rowLength)].map((_, index) => {
                return (
                  <button
                    key={index}
                    className={cn(styles.dot, {
                      [styles.dotActive]: activeDot === index,
                    })}
                    onClick={() => {
                      setActiveDot(index)
                      scrollRef.current.scrollTo({
                        left: index * (itemWidth + 12),
                        behavior: 'smooth',
                      })
                    }}
                  />
                )
              })}
            </Inline>
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default SimpleStackedSlider
