import React, { forwardRef,useContext } from 'react'
import cn from 'classnames'

import { Colors } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { ResponsiveSpace } from '../Box/useBoxStyles'
import { LinkContext } from '../context'

import {
  base,
  colors,
  defaultFontWeights,
  defaultLineHeights,
  fontWeight as fontWeightStyles,
  lineHeight as lineHeightStyles,
  strikethrough as strikethroughStyle,
  TextVariants,
  truncate as truncateStyle,
  variantStyles,
  whiteSpace as whiteSpaceStyle,
} from './Text.css'

type TextElements =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'caption'

export interface TextProps {
  id?: string
  children?: React.ReactNode
  as?: TextElements
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  paddingY?: ResponsiveSpace
  marginTop?: ResponsiveSpace
  marginBottom?: ResponsiveSpace
  marginY?: ResponsiveSpace
  variant?: TextVariants
  color?: Colors
  truncate?: boolean
  fontWeight?: keyof typeof fontWeightStyles
  lineHeight?: keyof typeof lineHeightStyles
  title?: string
  strikethrough?: boolean
  whiteSpace?:
    | 'normal'
    | 'nowrap'
    | 'pre'
    | 'preWrap'
    | 'preLine'
    | 'breakSpaces'
}

type GetTextStylesProps = Pick<
  TextProps,
  | 'variant'
  | 'color'
  | 'truncate'
  | 'fontWeight'
  | 'lineHeight'
  | 'strikethrough'
  | 'whiteSpace'
>

export const getTextStyles = ({
  color,
  truncate,
  fontWeight,
  lineHeight,
  variant = 'default',
  strikethrough,
  whiteSpace,
}: GetTextStylesProps) =>
  cn(base, {
    [variantStyles[variant!]]: variant,
    [colors[color!]]: color,
    [fontWeightStyles[fontWeight!]]: fontWeight,
    [lineHeightStyles[lineHeight!]]: lineHeight,
    [defaultFontWeights[variant!]]: variant && !fontWeight,
    [defaultLineHeights[variant!]]: variant && !lineHeight,
    [truncateStyle]: truncate,
    [strikethroughStyle]: strikethrough,
    [whiteSpaceStyle[whiteSpace!]]: whiteSpace,
  })

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      id,
      children,
      color,
      truncate,
      paddingTop,
      paddingBottom,
      paddingY,
      marginTop,
      marginBottom,
      marginY,
      fontWeight,
      lineHeight,
      variant = 'default',
      title,
      as = 'p',
      strikethrough,
      whiteSpace,
    },
    ref,
  ) => {
    const { linkRenderer } = useContext(LinkContext)
    return (
      <Box
        id={id}
        component={as}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginY={marginY}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingY={paddingY}
        className={getTextStyles({
          color,
          truncate,
          fontWeight,
          lineHeight,
          variant,
          strikethrough,
          whiteSpace,
        })}
        ref={ref}
        title={title}
      >
        {React.Children.map<React.ReactNode, React.ReactNode>(
          children,
          (child: any) => {
            if (child?.props?.href && child?.props?.as) {
              // Checking to see if the child  using "href" and "as" props, which indicates it
              // is (most likely) a next.js link since the linkRenderer breaks this functionality.
              // TODO: Make linkRenderer handle next.js links.
              return child
            } else if (
              child?.props?.href &&
              typeof linkRenderer === 'function'
            ) {
              return linkRenderer(child.props.href, child.props.children)
            }

            return child
          },
        )}
      </Box>
    )
  },
)
