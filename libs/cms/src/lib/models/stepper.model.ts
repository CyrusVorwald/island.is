import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from 'api-cms-domain'

import { IStepper } from '../generated/contentfulTypes'

import { mapStep, Step } from './step.model'

@ObjectType()
export class Stepper {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => [Step], { nullable: true })
  steps?: Array<Step>

  @Field({ nullable: true })
  config?: string
}

export const mapStepper = ({
  sys,
  fields,
}: IStepper): SystemMetadata<Stepper> => ({
  typename: 'AccordionSlice',
  id: sys.id,
  title: fields.title ?? '',
  steps: (fields.steps ?? []).map(mapStep),
  config: fields.config ? JSON.stringify(fields.config) : '',
})
