import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger'

import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeRightTypeDto,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeDTO,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import type { Auth } from '@island.is/auth-nest-tools'
import {
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit,AuditService } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'
import { Documentation } from '@island.is/nest/swagger'

import { environment } from '../../../environments'

const namespace = `${environment.audit.defaultNamespace}/right-types`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.adminPersonalRepresentative)
@ApiBearerAuth()
@ApiTags('Right Types')
@Controller('v1/right-types')
@Audit({ namespace })
export class RightTypesController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all right types */
  @Get()
  @Documentation({
    summary: 'Get a list of all right types for personal representatives',
    response: {
      status: 200,
      type: PaginatedPersonalRepresentativeRightTypeDto,
    },
  })
  @Audit<PaginatedPersonalRepresentativeRightTypeDto>({
    resources: (pgData) => pgData.data.map((type) => type.code),
  })
  async getAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    return this.rightTypesService.getMany(query)
  }

  /** Gets a right type by it's key */
  @Get(':code')
  @Documentation({
    summary: 'Get a single right type by code',
    response: { status: 200, type: PersonalRepresentativeRightType },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a type',
          type: String,
        },
      },
    },
  })
  @Audit<PersonalRepresentativeRightType>({
    resources: (type) => type.code,
  })
  async getAsync(
    @Param('code') code: string,
  ): Promise<PersonalRepresentativeRightType> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }

    const rightType = await this.rightTypesService.getPersonalRepresentativeRightType(
      code,
    )

    if (!rightType) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return rightType
  }
  /** Removes a right type by it's code, by making it invalid */
  @Delete(':code')
  @Documentation({
    summary: 'Delete a single right type by code',
    response: { status: 204 },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a type',
          type: String,
        },
      },
    },
  })
  async removeAsync(
    @Param('code') code: string,
    @CurrentAuth() user: Auth,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }
    // delete right type
    await this.auditService.auditPromise(
      {
        auth: user,
        action: 'deletePersonalRepresentativeRightType',
        namespace,
        resources: code,
      },
      this.rightTypesService.delete(code),
    )
  }

  /** Creates a right type */
  @Post()
  @Documentation({
    summary: 'Create a right type',
    response: { status: 201, type: PersonalRepresentativeRightType },
  })
  async create(
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeRightType> {
    // Create a new right type
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'createPersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.create(rightType),
    )
  }

  /** Updates a right type */
  @Put(':code')
  @Documentation({
    summary: 'Update a right type by code',
    response: { status: 200, type: PersonalRepresentativeRightType },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a type',
          type: String,
        },
      },
    },
  })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeRightType | null> {
    // Update right type
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updatePersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.update(code, rightType),
    )
  }
}
