import { gql } from '@apollo/client'

export const LimitedAccessCaseQuery = gql`
  query LimitedAccessCaseQuery($input: CaseQueryInput!) {
    limitedAccessCase(input: $input) {
      id
      origin
      type
      state
      policeCaseNumbers
      defendants {
        id
        noNationalId
        nationalId
        name
        gender
        address
        citizenship
      }
      defenderName
      defenderNationalId
      defenderEmail
      defenderPhoneNumber
      court {
        id
        name
        type
      }
      leadInvestigator
      requestedCustodyRestrictions
      creatingProsecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      prosecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      courtCaseNumber
      courtEndTime
      validToDate
      decision
      isValidToDateInThePast
      isCustodyIsolation
      isolationToDate
      conclusion
      rulingDate
      registrar {
        id
        name
        title
      }
      judge {
        id
        name
        title
      }
      courtRecordSignatory {
        id
        name
        title
      }
      courtRecordSignatureDate
      parentCase {
        id
        state
        validToDate
        decision
        courtCaseNumber
        ruling
      }
      childCase {
        id
      }
      caseModifiedExplanation
    }
  }
`
