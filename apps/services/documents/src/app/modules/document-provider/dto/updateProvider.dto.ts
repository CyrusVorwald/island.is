import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean,IsOptional, IsString } from 'class-validator'

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  endpoint?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  endpointType?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  apiScope?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  xroad?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  externalProviderId?: string
}
