import { registerEnumType } from '@nestjs/graphql'

import { MappedData } from '@island.is/content-search-indexer/types'

export enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export enum SortField {
  TITLE = 'title',
  POPULAR = 'popular',
}

export type elasticTagField = {
  key: string
  type: string
  value?: string
}

export interface SyncRequest {
  add: MappedData[]
  remove: string[]
}

export type sortableFields =
  | 'dateUpdated'
  | 'dateCreated'
  | 'title.sort'
  | 'popularityScore'

export type sortRule = {
  [key in sortableFields]?: {
    order: SortDirection
  }
}
registerEnumType(SortDirection, { name: 'SortDirection' })
registerEnumType(SortField, { name: 'SortField' })
