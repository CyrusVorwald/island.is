import React, { forwardRef,ReactElement, ReactNode } from 'react'
import { useMeasure } from 'react-use'
import { UseMeasureRef } from 'react-use/lib/useMeasure'
import cn from 'classnames'
import { ObjectFitProperty } from 'csstype'

import { Box } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Hyphen } from '../Hyphen/Hyphen'
import { Inline } from '../Inline/Inline'
import { Tag, TagProps } from '../Tag/Tag'
import { Text, TextProps } from '../Text/Text'

import * as styles from './CategoryCard.css'

export const STACK_WIDTH = 280

type Tag = {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export type CategoryCardProps = {
  ref?: UseMeasureRef<HTMLElement>
  width?: number
  heading: string
  headingAs?: TextProps['as']
  headingVariant?: TextProps['variant']
  text: string
  tags?: Tag[]
  tagOptions?: Pick<TagProps, 'hyphenate' | 'truncate' | 'textLeft'>
  href?: string
  colorScheme?: 'blue' | 'purple' | 'red'
  /** The heading above is truncated instead of overflowing */
  truncateHeading?: TextProps['truncate']
  /** Use event listener to check wether or not to place the image below the text content */
  autoStack?: boolean
  /** The card width breakpoint that the image should stack below content when autoStack = true */
  stackWidth?: number
  /** Hyphenate the heading */
  hyphenate?: boolean
}

const colorSchemes = {
  blue: {
    textColor: 'blue400',
    borderColor: 'blue200',
    tagVariant: 'blue',
  },
  purple: {
    textColor: 'purple400',
    borderColor: 'purple200',
    tagVariant: 'purple',
  },
  red: {
    textColor: 'red600',
    borderColor: 'red200',
    tagVariant: 'red',
  },
} as const

export type CategoryCardImage =
  | {
      src: string
      alt: string
      objectFit?: ObjectFitProperty
      customImage?: never
    }
  | {
      src?: never
      alt?: never
      objectFit?: never
      customImage?: ReactNode
    }

const Component = forwardRef<
  HTMLElement,
  CategoryCardProps & CategoryCardImage
>(
  (
    {
      width,
      stackWidth = STACK_WIDTH,
      heading,
      headingAs = 'h3',
      headingVariant = 'h3',
      text,
      href = '/',
      tags = [],
      colorScheme = 'blue',
      truncateHeading = false,
      src,
      alt,
      objectFit = 'contain',
      customImage,
      hyphenate = false,
      tagOptions,
      autoStack,
    },
    ref,
  ) => {
    const { borderColor, textColor, tagVariant } = colorSchemes[colorScheme]

    const hasTags = Array.isArray(tags) && tags.length > 0
    const hasImage = !!src || !!customImage

    const shouldStack = width && width < stackWidth

    return (
      <FocusableBox
        href={href}
        position="relative"
        display="flex"
        flexDirection="row"
        paddingY={3}
        paddingX={4}
        borderRadius="large"
        borderColor={borderColor}
        borderWidth="standard"
        height="full"
        width="full"
        background="white"
        color={colorScheme}
      >
        <Box
          ref={ref}
          display="flex"
          flexDirection={shouldStack ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          height="full"
          width="full"
        >
          <Box display="flex" height="full" width="full" flexDirection="column">
            <Text
              as={headingAs}
              variant={headingVariant}
              color={textColor}
              truncate={truncateHeading}
              title={heading}
            >
              {hyphenate ? <Hyphen>{heading}</Hyphen> : heading}
            </Text>
            <Text paddingTop={1}>{text}</Text>
            {hasTags && (
              <Box paddingTop={3}>
                <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
                  {tags.map((tag) => (
                    <Tag
                      key={tag.label}
                      disabled={tag.disabled}
                      outlined={!tag.href}
                      variant={tagVariant}
                      href={tag.href}
                      onClick={tag.onClick}
                      {...tagOptions}
                    >
                      {tag.label}
                    </Tag>
                  ))}
                </Inline>
              </Box>
            )}
          </Box>
          {hasImage &&
            (customImage ? (
              customImage
            ) : (
              <Box
                display="flex"
                position="relative"
                height="full"
                justifyContent="center"
                alignItems={shouldStack ? 'flexEnd' : 'center'}
                marginLeft={shouldStack ? 0 : 2}
                marginTop={shouldStack ? 2 : 0}
                className={cn({
                  [styles.imageContainerHidden]: !autoStack,
                })}
              >
                <img
                  src={src}
                  alt={alt}
                  style={{ objectFit }}
                  className={styles.image}
                />
              </Box>
            ))}
        </Box>
      </FocusableBox>
    )
  },
)

export const CategoryCard = (props: CategoryCardProps & CategoryCardImage) => {
  return props.autoStack ? (
    <WithMeasureProps>
      {(measureProps) => <Component {...props} {...measureProps} />}
    </WithMeasureProps>
  ) : (
    <Component {...props} />
  )
}

interface MeasureProps {
  children: ({
    ref,
    width,
  }: {
    ref: UseMeasureRef<HTMLElement>
    width: number
  }) => ReactElement | null
}

const WithMeasureProps = ({ children }: MeasureProps) => {
  const [ref, { width }] = useMeasure()

  return typeof children === 'function' ? children({ ref, width }) : children
}
