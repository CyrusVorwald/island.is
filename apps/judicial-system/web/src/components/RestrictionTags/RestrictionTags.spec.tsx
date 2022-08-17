import React from 'react'
import { render, screen } from '@testing-library/react'

import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'

import RestrctionTags from './RestrictionTags'

const renderRestrictionTags = (workingCase: Case) =>
  render(<RestrctionTags workingCase={workingCase} />)

describe('<RestrictionTags />', () => {
  const selector = { selector: 'span' }
  test('should not render for investication cases', () => {
    const theCase = { type: CaseType.BODY_SEARCH } as Case
    const result = renderRestrictionTags(theCase)

    expect(result.container).toBeEmptyDOMElement()
  })

  test('should render isolation restrction when isCustodyIsolation=true', () => {
    const theCase = { isCustodyIsolation: true } as Case
    renderRestrictionTags(theCase)

    expect(screen.getByText('Einangrun', selector)).toBeInTheDocument()
  })

  test('should render tags for accepted travel ban cases', () => {
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.getByText('Tilkynningarskylda', selector)).toBeInTheDocument()

    expect(screen.queryByText('Fjölmiðlabann', selector)).toBeNull()
    expect(screen.queryByText('Vinnubann', selector)).toBeNull()
  })

  test('should render tags for accepted travel ban cases', () => {
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.NECESSITIES,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.getByText('Tilkynningarskylda', selector)).toBeInTheDocument()

    expect(screen.queryByText('Bréfskoðun, símabann', selector)).toBeNull()
    expect(screen.queryByText('Einangrun', selector)).toBeNull()
    expect(screen.queryByText('Fjölmiðlabann', selector)).toBeNull()
    expect(screen.queryByText('Eigin nauðsynjar', selector)).toBeNull()
    expect(screen.queryByText('Heimsóknarbann', selector)).toBeNull()
    expect(screen.queryByText('Vinnubann', selector)).toBeNull()
  })

  test('should render tags for accepted custody cases', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.NECESSITIES,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.queryByText('Tilkynningarskylda', selector)).toBeNull()
    expect(screen.queryByText('Einangrun', selector)).toBeNull()

    expect(
      screen.getByText('Bréfskoðun, símabann', selector),
    ).toBeInTheDocument()
    expect(screen.getByText('Fjölmiðlabann', selector)).toBeInTheDocument()
    expect(screen.getByText('Eigin nauðsynjar', selector)).toBeInTheDocument()
    expect(screen.getByText('Heimsóknarbann', selector)).toBeInTheDocument()
    expect(screen.getByText('Vinnubann', selector)).toBeInTheDocument()
  })

  test('should render tags for accepted admission cases', () => {
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.NECESSITIES,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.queryByText('Tilkynningarskylda', selector)).toBeNull()

    expect(
      screen.getByText('Bréfskoðun, símabann', selector),
    ).toBeInTheDocument()
    expect(screen.getByText('Fjölmiðlabann', selector)).toBeInTheDocument()
    expect(screen.getByText('Eigin nauðsynjar', selector)).toBeInTheDocument()
    expect(screen.getByText('Heimsóknarbann', selector)).toBeInTheDocument()
    expect(screen.getByText('Vinnubann', selector)).toBeInTheDocument()
  })
})
