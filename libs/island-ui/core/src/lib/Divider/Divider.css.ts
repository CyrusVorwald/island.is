import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const base = style({
  height: theme.border.width.standard,
})

export const weight = styleVariants({
  regular: { background: theme.border.color.standard },
  strong: { background: theme.border.color.focus },
  alternate: { background: theme.color.purple200 },
  purple400: { background: theme.color.purple400 },
  purple200: { background: theme.color.purple200 },
  blueberry200: { background: theme.color.blueberry200 },
  red200: { background: theme.color.red200 },
})
