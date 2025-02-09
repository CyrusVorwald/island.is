import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_USER = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      maritalStatus
      religion
      legalResidence
      birthPlace
      familyNr
      fullName
      banMarking {
        banMarked
      }
      gender
      spouse {
        name
        nationalId
        cohabitant
      }
      citizenship {
        code
        name
      }
    }
  }
`
