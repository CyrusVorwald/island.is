import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOrganizationSubpage } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'
import { Image, mapImage } from './image.model'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'

@ObjectType()
export class OrganizationSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field(() => [String])
  url!: Array<string>

  @Field({ nullable: true })
  intro!: string

  @Field(() => [SliceUnion], { nullable: true })
  description?: Array<typeof SliceUnion>

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [SliceUnion], { nullable: true })
  slices?: Array<typeof SliceUnion | null>

  @Field(() => Boolean)
  showTableOfContents?: boolean

  @Field({ nullable: true })
  sliceCustomRenderer?: string

  @Field({ nullable: true })
  sliceExtraText?: string

  @Field(() => OrganizationPage)
  organizationPage!: OrganizationPage | null

  @Field(() => Image, { nullable: true })
  featuredImage?: Image | null
}

export const mapOrganizationSubpage = ({
  fields,
  sys,
}: IOrganizationSubpage): OrganizationSubpage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  url: [fields.organizationPage?.fields?.slug, fields.slug],
  intro: fields.intro ?? '',
  description: fields.description
    ? mapDocument(fields.description, sys.id + ':content')
    : [],
  links: (fields.links ?? []).map(mapLink),
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
  showTableOfContents: fields.showTableOfContents ?? false,
  sliceCustomRenderer: fields.sliceCustomRenderer ?? '',
  sliceExtraText: fields.sliceExtraText ?? '',
  organizationPage: fields.organizationPage
    ? mapOrganizationPage(fields.organizationPage)
    : null,
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
})
