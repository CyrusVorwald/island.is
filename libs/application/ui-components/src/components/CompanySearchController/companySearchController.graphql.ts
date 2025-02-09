import { gql } from '@apollo/client'

export const COMPANY_REGISTRY_COMPANIES = gql`
  query SearchCompanies($input: RskCompanyInfoSearchInput!) {
    companyRegistryCompanies(input: $input) {
      data {
        name
        nationalId
        companyInfo {
          vat {
            dateOfRegistration
            dateOfDeregistration
            classification {
              type
              classificationSystem
              number
              name
            }
          }
        }
      }
    }
  }
`
