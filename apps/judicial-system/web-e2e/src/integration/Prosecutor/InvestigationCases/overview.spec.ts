import faker from 'faker'

import { Case, CaseState } from '@island.is/judicial-system/types'
import { INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE } from '@island.is/judicial-system/consts'

import {
  investigationCaseAccusedAddress,
  investigationCaseAccusedName,
  makeInvestigationCase,
  makeProsecutor,
  intercept,
} from '../../../utils'

describe(`${INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/:id`, () => {
  const demands = faker.lorem.paragraph()
  const defenderName = faker.name.findName()
  const defenderEmail = faker.internet.email()
  const defenderPhoneNumber = faker.phone.phoneNumber()
  const caseData = makeInvestigationCase()

  beforeEach(() => {
    const caseDataAddition: Case = {
      ...caseData,
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      demands,
      seenByDefender: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      requestedCourtDate: '2020-09-20T19:50:08.033Z',
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/test_id`)
  })

  it('should let the user know if the assigned defender has viewed the case', () => {
    cy.getByTestid('alertMessageSeenByDefender').should('not.match', ':empty')
  })

  it('should have a info panel about how to resend a case if the case has been received', () => {
    cy.getByTestid('ic-overview-info-panel').should('exist')
  })

  it('should display information about the case in an info card', () => {
    cy.getByTestid('infoCard').contains(
      `${investigationCaseAccusedName}, kt. 000000-0000, ${investigationCaseAccusedAddress}`,
    )
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCard').contains('007-2021-202000') // Police case number
    cy.getByTestid('infoCard').contains('Lögreglan á Höfuðborgarsvæðinu') // Institution
    cy.getByTestid('infoCard').contains('Héraðsdómur Reykjavíkur') // Court
    cy.getByTestid('infoCard').contains(
      'Sunnud. 20. september 2020 eftir kl. 19:50',
    ) // Requested court date
    cy.getByTestid('infoCard').contains('Áki Ákærandi') // Prosecutor
    cy.getByTestid('infoCard').contains('Upplýsingar um vefnotkun') // Type
  })

  it('should display the demands', () => {
    cy.contains(demands)
  })

  it('should display a button to view request as PDF', () => {
    cy.getByTestid('requestPDFButton').should('exist')
  })

  it('should have a button that copies link to case for defender', () => {
    cy.getByTestid('copyLinkToCase').click()
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .then((data) => data)
      .should('equal', `${window.location.origin}/verjandi/${caseData.id}`)
  })

  it.skip('should navigate to /krofur on successful confirmation', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('contain', '/krofur')

    /**
     * This is practically considered bad(ish) practice since we're not testing
     * the overview in isolation anymore. Leaving this here until a better
     * way presents itself.
     */
    cy.getByTestid('tdTag').should('contain', 'Krafa móttekin')
  })
})
