import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { PersonalRepresentative } from './personal-representative.model'

@Table({
  tableName: 'personal_representative_type',
})
export class PersonalRepresentativeType extends Model<PersonalRepresentativeType> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty()
  code!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  validTo?: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @ApiProperty({ type: () => [PersonalRepresentative], required: false })
  @HasMany(() => PersonalRepresentative)
  personalRepresentatives?: PersonalRepresentative[]
}
