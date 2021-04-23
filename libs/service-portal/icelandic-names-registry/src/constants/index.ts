import { Colors } from '@island.is/island-ui/theme'

export const NameTypeStrings = {
  ST: 'Stúlkunafn',
  DR: 'Drengjanafn',
  MI: 'Millinafn',
  RST: 'Ritbreytt stúlkunafn',
  RDR: 'Ritbreytt drengjanafn',
} as { [key: string]: string }

export const NameStatusStrings = {
  Haf: 'Hafnað',
  Sam: 'Samþykkt',
  Óaf: 'Óafgreitt',
} as { [key: string]: string }

export const NameStatusStringColors = {
  Haf: 'red600',
  Sam: 'blue400',
  Óaf: 'yellow600',
} as { [key: string]: Colors }
