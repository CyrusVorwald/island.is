import { Field, ID,ObjectType } from '@nestjs/graphql'

import { RskCompanyAddress } from './rskCompanyAddress.model'
import { RskCompanyFormOfOperation } from './rskCompanyFormOfOperation.model'
import { RskCompanyRelatedParty } from './rskCompanyRelatedParty.model'
import { RskCompanyVat } from './rskCompanyVat.model'

@ObjectType()
export class RskCompanyInfo {
  @Field(() => [RskCompanyFormOfOperation])
  formOfOperation: RskCompanyFormOfOperation[] = []

  @Field(() => [RskCompanyAddress])
  address: RskCompanyAddress[] = []

  @Field(() => [RskCompanyRelatedParty])
  relatedParty: RskCompanyRelatedParty[] = []

  @Field(() => [RskCompanyVat])
  vat: RskCompanyVat[] = []
}

@ObjectType()
export class RskCompany {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => Date, { nullable: true })
  dateOfRegistration?: Date

  @Field(() => String)
  status!: string

  @Field(() => String)
  vatNumber?: string

  @Field(() => Date, { nullable: true })
  lastUpdated?: Date

  @Field(() => RskCompanyInfo, { nullable: true })
  companyInfo?: RskCompanyInfo
}
