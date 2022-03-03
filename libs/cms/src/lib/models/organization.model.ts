import { Field, ID,ObjectType } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'

import { FooterItem, mapFooterItem } from './footerItem.model'
import { Image, mapImage } from './image.model'
import { mapOrganizationTag,OrganizationTag } from './organizationTag.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  shortTitle?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @Field(() => Image, { nullable: true })
  logo?: Image | null

  @Field({ nullable: true })
  link?: string

  @Field(() => [FooterItem])
  footerItems?: Array<FooterItem>

  @Field()
  phone?: string

  @Field()
  email?: string

  @Field(() => String, { nullable: true })
  serviceWebTitle?: string | null

  @Field(() => Boolean, { nullable: true })
  serviceWebEnabled?: boolean
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields.title ?? '',
  shortTitle: fields.shortTitle ?? '',
  description: fields.description ?? '',
  slug: fields.slug ?? '',
  tag: (fields.tag ?? []).map(mapOrganizationTag),
  logo: fields.logo ? mapImage(fields.logo) : null,
  link: fields.link ?? '',
  footerItems: (fields.footerItems ?? []).map(mapFooterItem),
  phone: fields.phone ?? '',
  email: fields.email ?? '',
  serviceWebTitle: fields.serviceWebTitle ?? '',
  serviceWebEnabled: Boolean(fields.serviceWebEnabled),
})
