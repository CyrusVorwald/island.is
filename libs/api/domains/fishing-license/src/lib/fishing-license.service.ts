import { Inject, Injectable } from '@nestjs/common'
import {
  SkipApi,
  UtgerdirApi,
  FishingLicenseCodeType,
} from '@island.is/clients/fishing-license'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class FishingLicenseService {
  constructor(
    private readonly shipApi: SkipApi,
    private readonly utgerdirApi: UtgerdirApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getShips(nationalId: string, user: User) {
    try {
      const ships = await this.utgerdirApi
        .withMiddleware(new AuthMiddleware(user, { forwardUserInfo: false }))
        .v1UtgerdirKennitalaSkipGet({ kennitala: nationalId })

      return (
        ships.skip?.map((ship) => ({
          name: ship.skipanafn ?? '',
          deprivations:
            ship.sviptingar?.map((d) => ({
              validFrom: d.iGildi ?? undefined,
              invalidFrom: d.urGildi ?? undefined,
              explanation: d.skyring,
            })) ?? [],
          features: ship.einkenni ?? '',
          grossTons: ship.bruttotonn ?? 0,
          homePort: ship.heimahofn ?? '',
          length: ship.lengd ?? 0,
          registrationNumber: ship.skipaskrarnumer ?? 0,
          seaworthiness: ship.haffaeri
            ? { validTo: new Date(ship.haffaeri.gildistimi as Date) }
            : { validTo: new Date() },
          fishingLicenses:
            ship.veidileyfi?.map((v) => ({
              code:
                v.kodi === '1'
                  ? FishingLicenseCodeType.catchMark
                  : v.kodi === '32'
                  ? FishingLicenseCodeType.hookCatchLimit
                  : FishingLicenseCodeType.unknown,
              name: v.nafn ?? '',
              chargeType: v.vorunumerfjs ?? '',
            })) ?? [],
          doesNotFulfillFishingLicenses:
            ship.uppfyllirEkkertVeidileyfi ?? false,
          unfulfilledLicenses:
            ship.ouppfylltSkilyrdiVeidileyfa
              ?.filter((o) => o.astaedur && o.astaedur?.length > 0)
              ?.map((o) => ({
                fishingLicense: {
                  code:
                    o.veidileyfi?.kodi === '1'
                      ? FishingLicenseCodeType.catchMark
                      : o.veidileyfi?.kodi === '32'
                      ? FishingLicenseCodeType.hookCatchLimit
                      : FishingLicenseCodeType.unknown,
                  name: o.veidileyfi?.nafn || '',
                  chargeType: o.veidileyfi?.vorunumerfjs ?? '',
                },
                reasons:
                  o.astaedur?.map((x) => ({
                    description: x.lysing ?? '',
                    directions: x.leidbeining ?? '',
                  })) ?? [],
              })) ?? [],
        })) ?? []
      )
    } catch (error) {
      this.logger.error('Error when trying to get ships', error)
      throw new Error(
        'Villa kom upp þegar reynt var að sækja upplýsingar um skip á þinni kennitölu.',
      )
    }
  }

  async getFishingLicenses(shipRegistationNumber: number, user: User) {
    try {
      const licenses = await this.shipApi
        .withMiddleware(new AuthMiddleware(user, { forwardUserInfo: false }))
        .v1SkipSkipaskrarnumerVeidileyfiGet({
          skipaskrarnumer: shipRegistationNumber,
        })

      return (
        licenses.veidileyfiIBodi?.map((l) => ({
          fishingLicenseInfo: {
            code:
              l.veidileyfi?.kodi === '1'
                ? FishingLicenseCodeType.catchMark
                : l.veidileyfi?.kodi === '32'
                ? FishingLicenseCodeType.hookCatchLimit
                : FishingLicenseCodeType.unknown,
            name: l.veidileyfi?.nafn ?? '',
            chargeType: l.veidileyfi?.vorunumerfjs ?? '',
          },
          answer: !!l.svar,
          reasons:
            l.astaedur?.map((x) => ({
              description: x.lysing ?? '',
              directions: x.leidbeining ?? '',
            })) ?? [],
        })) ?? []
      )
    } catch (error) {
      this.logger.error('Error when trying to get fishing licenses', error)
      throw new Error(
        'Villa kom upp þegar reynt var að sækja veiðileyfi tengd skipinu sem var valið.',
      )
    }
  }
}
