import {
  Uppbod,
  VirkarHeimagistingar,
  VirkLeyfi,
  VottordSkeyti,
  EmbaettiOgStarfsstodvar,
  Skilabod,
  SyslMottakaGognPostRequest,
  AdiliTegund,
  VedbandayfirlitReguverkiSvarSkeyti,
  SkraningaradiliDanarbusSkeyti,
  SvarSkeytiFromJSON,
  TegundAndlags,
  AdiliDanarbus,
} from '../../gen/fetch'
import { uuid } from 'uuidv4'
import {
  SyslumennAuction,
  DataUploadResponse,
  Homestay,
  OperatingLicense,
  PaginatedOperatingLicenses,
  PaginationInfo,
  SyslumennApiPaginationInfo,
  Person,
  Attachment,
  CertificateInfoResponse,
  DistrictCommissionerAgencies,
  PersonType,
  AssetName,
  EstateMember,
  EstateAsset,
  EstateRegistrant,
} from './syslumennClient.types'
const UPLOAD_DATA_SUCCESS = 'Gögn móttekin'

export const mapDistrictCommissionersAgenciesResponse = (
  response: EmbaettiOgStarfsstodvar,
): DistrictCommissionerAgencies => {
  return {
    id: response.starfsstodID ?? '',
    name: response.nafn ?? '',
    place: response.stadur ?? '',
    address: response.adsetur ?? '',
  }
}

export const mapCertificateInfo = (
  response: VottordSkeyti,
): CertificateInfoResponse => {
  return {
    nationalId: response.kennitala,
    expirationDate: response.gildisTimi,
    releaseDate: response.utgafudagur,
  }
}
export const mapDataUploadResponse = (
  response: Skilabod,
): DataUploadResponse => {
  return {
    success: response.skilabod === UPLOAD_DATA_SUCCESS,
    message: response.skilabod,
    id: response.audkenni,
    caseNumber: response.malsnumer,
  }
}

export const mapHomestay = (homestay: VirkarHeimagistingar): Homestay => {
  return {
    registrationNumber: homestay.skraningarnumer ?? '',
    name: homestay.heitiHeimagistingar ?? '',
    address: homestay.heimilisfang ?? '',
    manager: homestay.abyrgdarmadur ?? '',
    year: homestay.umsoknarAr ? parseFloat(homestay.umsoknarAr) : undefined,
    city: homestay.sveitarfelag ?? '',
    guests: homestay.gestafjoldi,
    rooms: homestay.fjoldiHerbergja,
    propertyId: homestay.fastanumer ?? '',
    apartmentId: homestay.ibudanumer ?? '',
  }
}

export const mapSyslumennAuction = (auction: Uppbod): SyslumennAuction => ({
  office: auction.embaetti ?? '',
  location: auction.starfsstod ?? '',
  auctionType: auction.tegund ?? '',
  lotType: auction?.andlag?.trim() ?? '',
  lotName: auction.andlagHeiti ?? '',
  lotId: auction.fastanumer ?? '',
  lotItems: auction.lausafjarmunir ?? '',
  auctionDate: auction.dagsetning ? auction.dagsetning.toLocaleString() : '',
  auctionTime: auction.klukkan ?? '',
  petitioners: auction.gerdarbeidendur ?? '',
  respondent: auction.gerdartholar ?? '',
  auctionTakesPlaceAt: auction.uppbodStadur ?? '',
})

export const mapOperatingLicense = (
  operatingLicense: VirkLeyfi,
): OperatingLicense => ({
  id: operatingLicense.rowNum,
  issuedBy: operatingLicense.utgefidAf,
  licenseNumber: operatingLicense.leyfisnumer,
  location: operatingLicense.stadur,
  name: operatingLicense.kallast,
  street: operatingLicense.gata,
  postalCode: operatingLicense.postnumer,
  type: operatingLicense.tegund,
  type2: operatingLicense.tegund2,
  restaurantType: operatingLicense.tegundVeitingastadar,
  validFrom: operatingLicense.gildirFra,
  validTo: operatingLicense.gildirTil,
  licenseHolder: operatingLicense.leyfishafi,
  licenseResponsible: operatingLicense.abyrgdarmadur,
  category: operatingLicense.flokkur,
  outdoorLicense: operatingLicense.leyfiTilUtiveitinga,
  alcoholWeekdayLicense: operatingLicense.afgrAfgengisVirkirdagar,
  alcoholWeekendLicense: operatingLicense.afgrAfgengisAdfaranottFridaga,
  alcoholWeekdayOutdoorLicense:
    operatingLicense.afgrAfgengisVirkirdagarUtiveitingar,
  alcoholWeekendOutdoorLicense:
    operatingLicense.afgrAfgengisAdfaranottFridagaUtiveitingar,
  maximumNumberOfGuests: operatingLicense.hamarksfjoldiGesta,
  numberOfDiningGuests: operatingLicense.fjoldiGestaIVeitingum,
})

export const mapPaginationInfo = (
  paginationInfoHeaderJSON: string,
): PaginationInfo => {
  const paginationInfoFromHeader: SyslumennApiPaginationInfo = JSON.parse(
    paginationInfoHeaderJSON,
  )
  return {
    pageSize: paginationInfoFromHeader.PageSize,
    pageNumber: paginationInfoFromHeader.PageNumber,
    totalCount: paginationInfoFromHeader.TotalCount,
    totalPages: paginationInfoFromHeader.TotalPages,
    currentPage: paginationInfoFromHeader.CurrentPage,
    hasNext: paginationInfoFromHeader.HasNext,
    hasPrevious: paginationInfoFromHeader.HasPrevious,
  }
}

export const mapPaginatedOperatingLicenses = (
  searchQuery: string,
  paginationInfoHeaderJSON: string,
  results: VirkLeyfi[],
): PaginatedOperatingLicenses => ({
  paginationInfo: mapPaginationInfo(paginationInfoHeaderJSON),
  searchQuery: searchQuery,
  results: (results ?? []).map(mapOperatingLicense),
})

export function constructUploadDataObject(
  id: string,
  persons: Person[],
  attachments: Attachment[] | undefined,
  extraData: { [key: string]: string },
  uploadDataName: string,
  uploadDataId?: string,
): SyslMottakaGognPostRequest {
  return {
    payload: {
      audkenni: id,
      gognSkeytis: {
        audkenni: uploadDataId || uuid(),
        skeytaHeiti: uploadDataName,
        adilar: persons.map((p) => {
          return {
            id: uuid(),
            nafn: p.name,
            kennitala: p.ssn,
            simi: p.phoneNumber,
            tolvupostur: p.email,
            heimilisfang: p.homeAddress,
            postaritun: p.postalCode,
            sveitafelag: p.city,
            undirritad: p.signed,
            tegund: mapPersonEnum(p.type),
          }
        }),
        attachments: attachments?.map((attachment) => ({
          nafnSkraar: attachment.name,
          innihaldSkraar: attachment.content,
        })),

        gagnaMengi: extraData ?? {},
      },
    },
  }
}

function mapPersonEnum(e: PersonType) {
  switch (e) {
    case PersonType.Plaintiff:
      return AdiliTegund.NUMBER_0
    case PersonType.CounterParty:
      return AdiliTegund.NUMBER_1
    case PersonType.Child:
      return AdiliTegund.NUMBER_2
    case PersonType.CriminalRecordApplicant:
      return AdiliTegund.NUMBER_0
    case PersonType.MortgageCertificateApplicant:
      return AdiliTegund.NUMBER_0
    case PersonType.AnnouncerOfDeathCertificate:
      return AdiliTegund.NUMBER_0
  }
}

export const mapAssetName = (
  response: VedbandayfirlitReguverkiSvarSkeyti,
): AssetName => {
  return { name: response.heiti ?? '' }
}

export const estateMemberMapper = (estateRaw: AdiliDanarbus): EstateMember => {
  return {
    name: estateRaw.nafn ?? '',
    nationalId: estateRaw.kennitala ?? '',
    relation: estateRaw.tegundTengsla ?? 'Annað',
  }
}

export const assetMapper = (assetRaw: any): EstateAsset => {
  return {
    description: assetRaw.lysing ?? '',
    assetNumber: assetRaw.fastanumer ?? '',
    share: assetRaw.eignarhlutfall ?? 1,
  }
}

export const mapEstateRegistrant = (
  syslaData: SkraningaradiliDanarbusSkeyti,
): EstateRegistrant => {
  return {
    applicantEmail: syslaData.tolvuposturSkreningaradila ?? '',
    applicantPhone: syslaData.simiSkraningaradila ?? '',
    knowledgeOfOtherWills: syslaData.vitneskjaUmAdraErfdaskra ? 'yes' : 'no',
    districtCommissionerHasWill: syslaData.erfdaskraIVorsluSyslumanns ?? false,
    assets: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_0)
          .filter((a) => a?.fastanumer && /^[fF]{0,1}\d{7}$/.test(a.fastanumer))
          .map(assetMapper)
      : [],
    vehicles: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_1)
          .map(assetMapper)
      : [],
    ships: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_2)
          .map(assetMapper)
      : [],
    cash: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_3)
          .map(assetMapper)
      : [],
    flyers: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_4)
          .map(assetMapper)
      : [],
    estateMembers: syslaData.adilarDanarbus
      ? syslaData.adilarDanarbus.map(estateMemberMapper)
      : [],
    marriageSettlement: syslaData.kaupmaili ?? false,
    office: syslaData.embaetti ?? '',
    caseNumber: syslaData.malsnumer ?? '',
    dateOfDeath: syslaData.danardagur ?? '',
    nameOfDeceased: syslaData.nafnLatins ?? '',
    nationalIdOfDeceased: syslaData.kennitalaLatins ?? '',
    ownBusinessManagement: syslaData.eiginRekstur ?? false,
    assetsAbroad: syslaData.eignirErlendis ?? false,
    occupationRightViaCondominium:
      syslaData.buseturetturVegnaKaupleiguIbuda ?? false,
    bankStockOrShares: syslaData.bankareikningarVerdbrefEdaHlutabref ?? false,
  }
}
