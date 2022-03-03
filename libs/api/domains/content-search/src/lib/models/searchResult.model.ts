import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'

import {
  AdgerdirPage,
  Article,
  LifeEventPage,
  Link,
  News,
  OrganizationSubpage,
  SubArticle,
  SupportQNA,
} from '@island.is/cms'

import { TagCount } from './tagCount'
import { TypeCount } from './typeCount'

const Items = createUnionType({
  name: 'Items',
  types: () => [
    Article,
    LifeEventPage,
    News,
    AdgerdirPage,
    SubArticle,
    OrganizationSubpage,
    SupportQNA,
    Link,
  ], // add new return types here
  resolveType: (document) => document.typename, // typename is appended to request on mapping
})

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total!: number

  @Field(() => [Items])
  items!: Array<typeof Items>

  @Field(() => [TagCount], { nullable: true })
  tagCounts?: TagCount[]

  @Field(() => [TypeCount], { nullable: true })
  typesCount?: TypeCount[]

  @Field(() => Int, { nullable: true })
  processEntryCount?: number
}

// TODO: Classes form multiple domains can conflict here, look into adding namespace prefixes to classes
