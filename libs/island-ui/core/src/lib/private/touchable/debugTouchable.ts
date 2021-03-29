type SelectorMap = any

export const debugTouchable = ({ after = false } = {}): SelectorMap =>
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        [`[data-braid-debug] &${after ? ':after' : ''}`]: {
          background: 'red',
          opacity: 0.2,
        },
      }
