import { Field, ID,ObjectType } from '@nestjs/graphql'

import { UserInfo as TUserInfo } from '@island.is/air-discount-scheme/types'

import { FlightLeg } from '../flightLeg'
import { User } from '../user'

@ObjectType()
export class UserInfo implements TUserInfo {
  @Field()
  gender: 'kk' | 'kvk' | 'hvk'

  @Field()
  age: number

  @Field()
  postalCode: number
}

@ObjectType()
export class Flight {
  @Field((_1) => ID)
  id: string

  @Field()
  bookingDate: string

  @Field((_1) => [FlightLeg])
  flightLegs: FlightLeg[]

  @Field((_1) => User)
  user: User

  @Field((_1) => UserInfo)
  userInfo: UserInfo
}
