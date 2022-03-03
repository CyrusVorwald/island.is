import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import {
  CheckboxFormField,
  TextFormField,
} from '@island.is/application/ui-fields'
import { Box, Text } from '@island.is/island-ui/core'

import { complaint } from '../lib/messages'
import { SubjectOfComplaint } from '../shared'

export const ReasonsForComplaint: FC<FieldBaseProps> = ({
  field,
  application,
  error,
}) => {
  const { register, errors, setValue } = useFormContext()
  const [statefulOtherReason, setStatefulOtherReason] = useState(
    getValueViaPath(application.answers, 'otherReason' || '') as string,
  )
  const [statefulCheckbox, setStatefulCheckbox] = useState(
    (getValueViaPath(
      application.answers,
      'subjectOfComplaint.values',
    ) as string[]) || [],
  )

  const onSelect = (selected: string[]) => {
    // Clear input value if other is deselected
    if (statefulCheckbox.includes('other') && !selected.includes('other')) {
      setValue('subjectOfComplaint.somethingElse', '')
    }
    setStatefulCheckbox(selected)
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setStatefulOtherReason(e.target.value)
  }

  const getValueConditionallyRequiredValue = () => {
    if (statefulCheckbox.includes('other')) {
      return statefulOtherReason
    }
    return 'someValue'
  }

  return (
    <div>
      <CheckboxFormField
        application={application}
        error={error}
        field={{
          id: 'subjectOfComplaint.values',
          title: '',
          onSelect,
          type: FieldTypes.CHECKBOX,
          component: FieldComponents.CHECKBOX,
          defaultValue: [],
          backgroundColor: 'blue',
          children: undefined,
          options: [
            {
              label: complaint.labels.subjectAuthorities,
              value: SubjectOfComplaint.WITH_AUTHORITIES,
            },
            {
              label: complaint.labels.subjectLackOfEducation,
              value: SubjectOfComplaint.LACK_OF_EDUCATION,
            },
            {
              label: complaint.labels.subjectSocialMedia,
              value: SubjectOfComplaint.SOCIAL_MEDIA,
            },
            {
              label: complaint.labels.subjectRequestForAccess,
              value: SubjectOfComplaint.REQUEST_FOR_ACCESS,
            },
            {
              label: complaint.labels.subjectRightOfObjection,
              value: SubjectOfComplaint.RIGHTS_OF_OBJECTION,
            },
            {
              label: complaint.labels.subjectEmail,
              value: SubjectOfComplaint.EMAIL,
            },
            {
              label: complaint.labels.subjectNationalId,
              value: SubjectOfComplaint.NATIONAL_ID,
            },
            {
              label: complaint.labels.subjectEmailInWorkplace,
              value: SubjectOfComplaint.EMAIL_IN_WORKPLACE,
            },
            {
              label: complaint.labels.subjectUnauthorizedPublication,
              value: SubjectOfComplaint.UNAUTHORIZED_PUBLICATION,
            },
            {
              label: complaint.labels.subjectVanskilaskra,
              value: SubjectOfComplaint.VANSKILASKRA,
            },
            {
              label: complaint.labels.subjectVideoRecording,
              value: SubjectOfComplaint.VIDEO_RECORDINGS,
            },
            {
              label: complaint.labels.subjectOtherOther,
              value: SubjectOfComplaint.OTHER,
            },
          ],
          large: true,
        }}
      />
      {statefulCheckbox.includes('other') ? (
        <>
          <TextFormField
            application={application}
            error={error}
            showFieldName={true}
            field={{
              ...field,
              type: FieldTypes.TEXT,
              component: FieldComponents.TEXT,
              children: undefined,
              defaultValue: application.answers.otherReason || '',
              id: 'subjectOfComplaint.somethingElse',
              title: complaint.labels.subjectSomethingElse,
              placeholder: complaint.labels.subjectSomethingElsePlaceholder,
              backgroundColor: 'blue',
              required: true,
              maxLength: 150,
              onChange,
            }}
          />
          {errors &&
            getErrorViaPath(
              errors,
              'subjectOfComplaint.somethingElseValue',
            ) && (
              <Box color="red600" paddingY={2} display="flex">
                <Text fontWeight="semiBold" color="red600">
                  {getErrorViaPath(
                    errors,
                    'subjectOfComplaint.somethingElseValue',
                  )}
                </Text>
              </Box>
            )}
        </>
      ) : null}
      <input
        type="hidden"
        ref={register({ required: true })}
        id="subjectOfComplaint.somethingElseValue"
        name="subjectOfComplaint.somethingElseValue"
        value={getValueConditionallyRequiredValue() || ''}
      />
    </div>
  )
}
