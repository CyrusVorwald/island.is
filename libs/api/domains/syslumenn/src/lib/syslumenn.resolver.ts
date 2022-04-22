import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetHomestaysInput } from './dto/getHomestays.input'
import { GetOperatingLicensesInput } from './dto/getOperatingLicenses.input'
import { Homestay } from './models/homestay'
import { SyslumennAuction } from './models/syslumennAuction'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { PaginatedOperatingLicenses } from './models/paginatedOperatingLicenses'
import { CertificateInfoResponse } from './models/certificateInfo'
import { DistrictCommissionerAgencies } from './models/districtCommissionerAgencies'
import { RealEstateAddress } from './models/realEstateAddress'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import {
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

const cacheTime = process.env.CACHE_TIME || 300

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class SyslumennResolver {
  constructor(private syslumennService: SyslumennService) {}

  @Directive(cacheControlDirective())
  @Query(() => [Homestay])
  @BypassAuth()
  getHomestays(@Args('input') input: GetHomestaysInput): Promise<Homestay[]> {
    return this.syslumennService.getHomestays(input.year)
  }

  // Note: We don't cache the Auction data, as it's prone to changes only minutes before the auction takes place.
  @Query(() => [SyslumennAuction])
  @BypassAuth()
  getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    return this.syslumennService.getSyslumennAuctions()
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedOperatingLicenses)
  @BypassAuth()
  getOperatingLicenses(
    @Args('input') input: GetOperatingLicensesInput,
  ): Promise<PaginatedOperatingLicenses> {
    return this.syslumennService.getOperatingLicenses(
      input.searchBy,
      input.pageNumber,
      input.pageSize,
    )
  }

  @Query(() => CertificateInfoResponse)
  @Scopes(ApiScope.internal)
  getSyslumennCertificateInfo(
    @CurrentUser() user: User,
  ): Promise<CertificateInfoResponse | null> {
    return this.syslumennService.getCertificateInfo(user.nationalId)
  }

  @Query(() => [DistrictCommissionerAgencies])
  @BypassAuth()
  getSyslumennDistrictCommissionersAgencies(): Promise<
    DistrictCommissionerAgencies[]
  > {
    return this.syslumennService.getDistrictCommissionersAgencies()
  }

  @Query(() => [RealEstateAddress])
  @BypassAuth()
  getRealEstateAddress(
    @Args('input') realEstateId: string,
  ): Promise<Array<RealEstateAddress>> {
    return this.syslumennService.getRealEstateAddress(realEstateId)
  }
}
