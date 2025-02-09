import set from 'lodash/set'
import addDays from 'date-fns/addDays'
import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  Field,
  FieldComponents,
  FieldTypes,
  FormValue,
} from '@island.is/application/types'

import { NO, MANUAL, ParentalRelations, YES } from '../constants'
import { ChildInformation } from '../dataProviders/Children/types'
import {
  formatIsk,
  getAvailableRightsInMonths,
  getExpectedDateOfBirth,
  getSelectedChild,
  getTransferredDays,
  getOtherParentId,
  calculateEndDateForPeriodWithStartAndLength,
  calculatePeriodLengthInMonths,
  applicantIsMale,
  getOtherParentName,
  removeCountryCode,
  getSpouseDeprecated,
  getSpouse,
  getOtherParentOptions,
  isEligibleForParentalLeave,
  getPeriodIndex,
  getApplicationExternalData,
  requiresOtherParentApproval,
} from './parentalLeaveUtils'
import { PersonInformation } from '../types'

function buildApplication(data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    applicantActors: [],
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

function buildField(): Field {
  return {
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
    id: 'periods',
    title: 'fieldTitle',
    children: undefined,
  }
}

describe('getExpectedDateOfBirth', () => {
  it('should return undefined when no child is found', () => {
    const application = buildApplication()
    const res = getExpectedDateOfBirth(application)

    expect(res).toBeUndefined()
  })

  it('should return the selected child expected DOB', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: undefined, // Transferred days are only defined for secondary parents
                parentalRelation: ParentalRelations.primary,
                expectedDateOfBirth: '2021-05-17',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = getExpectedDateOfBirth(application)

    expect(res).toEqual('2021-05-17')
  })
})

describe('formatIsk', () => {
  it('should take a number as input and format it following ISK format', () => {
    const res = formatIsk(100000)

    expect(res).toEqual('100.000 kr.')
  })
})

describe('getTransferredDays', () => {
  it('should return the number of days requested by the primary parent', () => {
    const application = buildApplication({
      answers: {
        requestRights: {
          isRequestingRights: 'yes',
          requestDays: 45,
        },
      },
    })

    const child = {
      hasRights: true,
      remainingDays: 180,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    } as ChildInformation

    const res = getTransferredDays(application, child)

    expect(res).toEqual(45)
  })

  it('should return the number of days given by the primary parent', () => {
    const application = buildApplication({
      answers: {
        giveRights: {
          isGivingRights: 'yes',
          giveDays: 45,
        },
      },
    })

    const child = {
      hasRights: true,
      remainingDays: 180,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    } as ChildInformation

    const res = getTransferredDays(application, child)

    expect(res).toEqual(-45)
  })

  it('should return the number of days given to the secondary parent', () => {
    const application = buildApplication({
      answers: {},
    })

    const child = {
      hasRights: true,
      remainingDays: 180,
      transferredDays: 45,
      parentalRelation: ParentalRelations.secondary,
      expectedDateOfBirth: '2021-05-17',
    } as ChildInformation

    const res = getTransferredDays(application, child)

    expect(res).toEqual(45)
  })
})

describe('getAvailableRightsInMonths', () => {
  it('should return an error when no child is selected', () => {
    const application = buildApplication()

    expect(() => {
      getAvailableRightsInMonths(application)
    }).toThrow('Missing selected child')
  })

  it('should return the number of rights in months for the selected child', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                parentalRelation: ParentalRelations.primary,
                expectedDateOfBirth: '2021-05-17',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = getAvailableRightsInMonths(application)

    expect(res).toBe(6)
  })
})

describe('getSpouseDeprecated', () => {
  it('should return undefined without spouse', () => {
    const application = buildApplication()
    expect(getSpouseDeprecated(application)).toEqual(undefined)
  })
})

describe('getSpouse', () => {
  it('should return null with no spouse', () => {
    const application = buildApplication()
    expect(getSpouse(application)).toEqual(null)
  })
  it('should return name and national ID of spouse', () => {
    const application = buildApplication({
      externalData: {
        person: {
          data: {
            spouse: {
              name: 'my spouse',
              nationalId: 'spouse national ID',
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    expect(getSpouse(application)).toEqual({
      name: 'my spouse',
      nationalId: 'spouse national ID',
    })
  })
})

describe('getOtherParentOptions', () => {
  it('should return default options for the other parent', () => {
    const application = buildApplication()
    expect(getOtherParentOptions(application)).toEqual([
      {
        dataTestId: 'no-other-parent',
        label: {
          defaultMessage: 'Ég vil ekki staðfesta hitt foreldrið að svo stöddu',
          description:
            'I do not want to confirm the other parent at this time.',
          id: 'pl.application:otherParent.none',
        },
        value: 'no',
      },
      {
        dataTestId: 'other-parent',
        label: {
          defaultMessage: 'Hitt foreldrið er:',
          description: 'The other parent is:',
          id: 'pl.application:otherParent.option',
        },
        value: 'manual',
      },
    ])
  })
})

describe('isEligableForParentalLeave', () => {
  it('should return undefined without data', () => {
    const application = buildApplication()
    expect(isEligibleForParentalLeave(application.externalData)).toEqual(
      undefined,
    )
  })
})

describe('getSelectedChild', () => {
  it('should return null if it cannot find a child', () => {
    const answers = {}
    const externalData = {}
    const res = getSelectedChild(answers, externalData)

    expect(res).toBeNull()
  })

  it('should return the selected child', () => {
    const answers = {
      selectedChild: 0,
    }

    const externalData = {
      children: {
        data: {
          children: [
            {
              hasRights: true,
              remainingDays: 180,
              transferredDays: undefined, // Transferred days are only defined for secondary parents
              parentalRelation: ParentalRelations.primary,
              expectedDateOfBirth: '2021-05-17',
            },
          ],
          existingApplications: [],
        },
        date: new Date(),
        status: 'success',
      },
    } as ExternalData

    const res = getSelectedChild(answers, externalData)

    expect(res).toEqual({
      hasRights: true,
      remainingDays: 180,
      transferredDays: undefined,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    })
  })
})

describe('getPeriodIndex', () => {
  it('should return -1 if field id is missing', () => {
    expect(getPeriodIndex()).toEqual(-1)
  })
  it('should return 0 if field id === periods', () => {
    const field = buildField()
    expect(getPeriodIndex(field)).toEqual(0)
  })
})

describe('getApplicationExternalData', () => {
  it('should get external data from application with expected return values', () => {
    const application = buildApplication({
      externalData: {
        children: {
          data: {
            children: 'Mock child',
            existingApplications: 'Mock application',
          },
          date: new Date(),
          status: 'success',
        },
        userProfile: {
          data: {
            email: 'mock@email.is',
            mobilePhoneNumber: 'Mock number',
          },
          date: new Date(),
          status: 'success',
        },
        person: {
          data: {
            genderCode: 'Mock gender code',
            fullName: 'Mock name',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    expect(getApplicationExternalData(application.externalData)).toEqual({
      applicantGenderCode: 'Mock gender code',
      applicantName: 'Mock name',
      children: 'Mock child',
      dataProvider: {
        children: 'Mock child',
        existingApplications: 'Mock application',
      },
      existingApplications: 'Mock application',
      userEmail: 'mock@email.is',
      userPhoneNumber: 'Mock number',
    })
  })
})

describe('requiresOtherParentApproval', () => {
  it('should return false when conditions not met', () => {
    const application = buildApplication()
    expect(
      requiresOtherParentApproval(
        application.answers,
        application.externalData,
      ),
    ).toBe(false)
  })
  it('should return true when usePersonalAllowanceFromSpouse === YES ', () => {
    const application = buildApplication({
      answers: {
        usePersonalAllowanceFromSpouse: YES,
      },
    })
    expect(
      requiresOtherParentApproval(
        application.answers,
        application.externalData,
      ),
    ).toBe(true)
  })
})

describe('getOtherParentId', () => {
  let id = 0
  const createApplicationBase = (): Application => ({
    answers: {},
    applicant: '',
    assignees: [],
    attachments: {},
    created: new Date(),
    modified: new Date(),
    applicantActors: [],
    externalData: {},
    id: (id++).toString(),
    state: '',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    name: '',
    status: ApplicationStatus.IN_PROGRESS,
  })

  let application: Application
  beforeEach(() => {
    application = createApplicationBase()
  })

  it('should return undefined if NO parent is selected', () => {
    application.answers.otherParentObj = {
      chooseOtherParent: NO,
    }

    expect(getOtherParentId(application)).toBeUndefined()
  })

  it('should return answers.otherParentId if manual is selected', () => {
    const expectedId = '1234567899'

    application.answers.otherParentObj = {
      chooseOtherParent: MANUAL,
      otherParentId: expectedId,
    }

    expect(getOtherParentId(application)).toBe(expectedId)
  })

  it('should return spouse if spouse is selected', () => {
    const expectedSpouse: PersonInformation['spouse'] = {
      name: 'Spouse Spouseson',
      nationalId: '1234567890',
    }

    application.externalData.person = {
      data: {
        spouse: expectedSpouse,
      },
      date: new Date(),
      status: 'success',
    }
    application.answers.otherParentObj = {
      chooseOtherParent: 'spouse',
    }

    expect(getOtherParentId(application)).toBe(expectedSpouse.nationalId)
  })
})

describe('getOtherParentName', () => {
  let id = 0
  const createApplicationBase = (): Application => ({
    answers: {},
    applicant: '',
    assignees: [],
    attachments: {},
    created: new Date(),
    modified: new Date(),
    applicantActors: [],
    externalData: {},
    id: (id++).toString(),
    state: '',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    name: '',
    status: ApplicationStatus.IN_PROGRESS,
  })

  let application: Application
  beforeEach(() => {
    application = createApplicationBase()
  })

  it('should return undefined if NO parent is selected', () => {
    application.answers.otherParentObj = {
      chooseOtherParent: NO,
    }

    expect(getOtherParentName(application)).toBeUndefined()
  })

  it('should return answers.otherParentName if manual is selected', () => {
    const expectedName = '1234567899'

    application.answers.otherParentObj = {
      chooseOtherParent: MANUAL,
      otherParentName: expectedName,
    }

    expect(getOtherParentName(application)).toBe(expectedName)
  })

  it('should return spouse if spouse is selected', () => {
    const expectedSpouse: PersonInformation['spouse'] = {
      name: 'Spouse Spouseson',
      nationalId: '1234567890',
    }

    application.externalData.person = {
      data: {
        spouse: expectedSpouse,
      },
      date: new Date(),
      status: 'success',
    }
    application.answers.otherParentObj = {
      chooseOtherParent: 'spouse',
    }

    expect(getOtherParentName(application)).toBe(expectedSpouse.name)
  })
})

describe('calculateEndDateForPeriodWithStartAndLength', () => {
  it('should calculate month + n and day of month - 1 for whole months', () => {
    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-01', 1),
    ).toEqual(new Date(2021, 0, 31))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-01', 2),
    ).toEqual(new Date(2021, 1, 28))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-01', 3),
    ).toEqual(new Date(2021, 2, 31))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-06-15', 1),
    ).toEqual(new Date(2021, 6, 14))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-31', 1),
    ).toEqual(new Date(2021, 1, 27))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-03-31', 1),
    ).toEqual(new Date(2021, 3, 29))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-02-28', 1),
    ).toEqual(new Date(2021, 2, 27))
  })

  it('should calculate month + n and multiply remainder with 28', () => {
    const addWholeMonthsPlusRemainder = (
      startDate: string,
      wholeMonths: number,
      remainder: number,
    ) => {
      const whole = calculateEndDateForPeriodWithStartAndLength(
        startDate,
        wholeMonths,
      )

      return addDays(whole, remainder * 28)
    }

    expect(addWholeMonthsPlusRemainder('2021-01-01', 0, 0.5)).toEqual(
      new Date(2021, 0, 0.5 * 28),
    )

    expect(addWholeMonthsPlusRemainder('2021-01-01', 1, 0.5)).toEqual(
      new Date(2021, 1, 0.5 * 28),
    )

    expect(addWholeMonthsPlusRemainder('2021-01-01', 5, 0.5)).toEqual(
      new Date(2021, 5, 0.5 * 28),
    )

    expect(addWholeMonthsPlusRemainder('2021-02-28', 0, 0.5)).toEqual(
      new Date(2021, 2, 0.5 * 28 - 1),
    )

    expect(addWholeMonthsPlusRemainder('2021-03-01', 0, 0.5)).toEqual(
      new Date(2021, 2, 0.5 * 28),
    )
  })
})

describe('calculatePeriodLengthInMonths', () => {
  it('should calculate whole months correctly', () => {
    expect(
      calculatePeriodLengthInMonths(
        '2021-01-01',
        calculateEndDateForPeriodWithStartAndLength(
          '2021-01-01',
          1,
        ).toISOString(),
      ),
    ).toBe(1)

    expect(
      calculatePeriodLengthInMonths(
        '2021-01-31',
        calculateEndDateForPeriodWithStartAndLength(
          '2021-01-31',
          1,
        ).toISOString(),
      ),
    ).toBe(1)
  })

  it('should calculate half months correctly', () => {
    expect(calculatePeriodLengthInMonths('2021-01-01', '2021-01-14')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-01-14', '2021-01-28')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-01-31', '2021-02-13')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-03-13')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-03-27')).toBe(1)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-04-13')).toBe(1.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-05-13')).toBe(2.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-07-13')).toBe(4.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2022-07-13')).toBe(16.5)
    expect(calculatePeriodLengthInMonths('2021-03-27', '2021-04-11')).toBe(0.5)
  })
})

describe('applicantIsMale', () => {
  it('should return false if genderCode is missing', () => {
    const application = buildApplication()

    expect(applicantIsMale(application)).toBe(false)
  })

  it('should return false if genderCode is present and !== "1"', () => {
    const application1 = buildApplication()
    const application2 = buildApplication()
    const application3 = buildApplication()

    set(application1.externalData, 'person.data.genderCode', '0')
    set(application2.externalData, 'person.data.genderCode', 'invalid')
    set(application3.externalData, 'person.data.genderCode', '11')

    expect(applicantIsMale(application1)).toBe(false)
    expect(applicantIsMale(application2)).toBe(false)
    expect(applicantIsMale(application3)).toBe(false)
  })

  it('should return true if genderCode is === "1"', () => {
    const application = buildApplication()

    set(application.externalData, 'person.data.genderCode', '1')

    expect(applicantIsMale(application)).toBe(true)
  })
})

describe('removeCountryCode', () => {
  it('should return the last 7 digits of the phone number', () => {
    const application = buildApplication()
    set(
      application.externalData,
      'userProfile.data.mobilePhoneNumber',
      '+3541234567',
    )
    expect(removeCountryCode(application)).toEqual('1234567')
  })
  it('should return the last 7 digits of the phone number', () => {
    const application = buildApplication()
    set(
      application.externalData,
      'userProfile.data.mobilePhoneNumber',
      '003541234567',
    )
    expect(removeCountryCode(application)).toEqual('1234567')
  })
  it("should return null if phone number wouldn't exist", () => {
    const application = buildApplication()
    set(application.externalData, 'userProfile', null)
    expect(removeCountryCode(application)).toEqual(undefined)
  })
})
