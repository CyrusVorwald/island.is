import { Allow, ArrayMinSize, IsArray, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { CaseType, CreateCase } from '@island.is/judicial-system/types'

@InputType()
export class CreateCaseInput implements CreateCase {
  @Allow()
  @Field(() => String)
  readonly type!: CaseType

  @Allow()
  @Field({ nullable: true })
  readonly description?: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Field(() => [String])
  readonly policeCaseNumbers!: string[]

  @Allow()
  @Field({ nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly sendRequestToDefender?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly leadInvestigator?: string
}
