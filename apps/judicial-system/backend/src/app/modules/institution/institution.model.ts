import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { InstitutionType } from '@island.is/judicial-system/types'

@Table({
  tableName: 'institution',
  timestamps: true,
})
export class Institution extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(InstitutionType),
  })
  type!: InstitutionType

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  active!: boolean

  @ForeignKey(() => Institution)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  defaultCourtId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  policeCaseNumberPrefix?: string
}
