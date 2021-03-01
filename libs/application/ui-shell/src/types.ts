import {
  Field,
  MultiField,
  ExternalDataProvider,
  Repeater,
  FormNode,
  Schema,
  LineRepeater,
} from '@island.is/application/core'

type ScreenAttributes = {
  isNavigable?: boolean
  sectionIndex: number
  subSectionIndex: number
}

export type FieldDef = ScreenAttributes & Field

export type MultiFieldScreen = ScreenAttributes &
  MultiField & {
    children: FieldDef[]
  }

export type RepeaterScreen = ScreenAttributes &
  Repeater & {
    children: (FieldDef | MultiFieldScreen | RepeaterScreen)[]
  }

export type LineRepeaterScreen = ScreenAttributes &
  LineRepeater & {
    children: FieldDef[]
  }

export type ExternalDataProviderScreen = ScreenAttributes & ExternalDataProvider

export type FormScreen =
  | FieldDef
  | ExternalDataProviderScreen
  | MultiFieldScreen
  | RepeaterScreen
  | LineRepeaterScreen

export type ResolverContext = {
  formNode: FormNode
  dataSchema: Schema
}

export type BeforeSubmitCallback = () => Promise<[true, null] | [false, string]>
export type SetBeforeSubmitCallback = (
  callback: BeforeSubmitCallback | null,
) => void
