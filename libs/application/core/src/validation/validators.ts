import { ZodSuberror } from 'zod/lib/src/ZodError'
import { ZodUnion } from 'zod/lib/src/types/union'
import { ZodTypeAny } from 'zod/lib/src/types/base'
import isNumber from 'lodash/isNumber'
import has from 'lodash/has'
import set from 'lodash/set'
import merge from 'lodash/merge'

import {
  Schema,
  StaticText,
  StaticTextObject,
  ValidationRecord,
  FormatMessage,
  Answer,
  FormValue,
  RecordObject,
} from '@island.is/application/types'
import { coreErrorMessages } from '../lib/messages'
import { AnswerValidationError } from './AnswerValidator'

function populateError(
  currentError: ValidationRecord = {},
  newError: ZodSuberror[],
  pathToError: string | undefined,
  formatMessage: FormatMessage,
) {
  let errorObject = {}
  const defaultZodError = newError[0].message === 'Invalid value.'

  newError.forEach((element) => {
    const path = pathToError || element.path
    let message = formatMessage(coreErrorMessages.defaultError)

    if (element.code === 'custom_error') {
      const namespaceRegex = /^\w*\.\w*:.*/g
      const includeNamespace = element?.params?.id?.match(namespaceRegex)?.[0]

      if (includeNamespace) {
        message = formatMessage(element.params as StaticTextObject)
      } else if (!defaultZodError) {
        message = element.message
      }
    }

    errorObject = set(errorObject, path, message)
  })

  return merge(currentError, errorObject)
}

function constructPath(currentPath: string, newKey: string) {
  if (currentPath === '') {
    return newKey
  }

  return `${currentPath}.${newKey}`
}

function partialSchemaValidation(
  answers: FormValue,
  originalSchema: Schema,
  error: ValidationRecord | undefined,
  currentPath = '',
  sendConstructedPath: boolean,
  formatMessage: FormatMessage,
): ValidationRecord | undefined {
  Object.keys(answers).forEach((key) => {
    const constructedErrorPath = constructPath(currentPath, key)
    const answer = answers[key]

    // ZodUnions do not have .pick method
    const trimmedSchema = originalSchema.pick
      ? originalSchema.pick({ [key]: true })
      : originalSchema

    try {
      trimmedSchema.parse({ [key]: answer })
    } catch (e) {
      const zodErrors: ZodSuberror[] = e.errors

      if (!has(error, constructedErrorPath)) {
        error = populateError(
          error,
          zodErrors,
          sendConstructedPath ? constructedErrorPath : undefined,
          formatMessage,
        )
      }

      if (Array.isArray(answer)) {
        const arrayElements = answer as Answer[]

        arrayElements.forEach((el, index) => {
          try {
            trimmedSchema.parse({ [key]: [el] })
          } catch (e) {
            let schemaShape = trimmedSchema?.shape[key]?._def?.type

            // z.array().optional(), f.x, is a union type rather than a simple array type
            if (!schemaShape && trimmedSchema?.shape[key]?._def?.options) {
              const arrayOption = (trimmedSchema.shape[key] as ZodUnion<
                [ZodTypeAny, ZodTypeAny]
              >)._def.options.find((opt) => opt?._def?.t === 'array')
              schemaShape = arrayOption?._def?.type
            }

            if (el !== null && typeof el === 'object') {
              partialSchemaValidation(
                el as FormValue,
                schemaShape,
                error,
                `${constructedErrorPath}[${index}]`,
                true,
                formatMessage,
              )
            }
          }
        })
      } else if (typeof answer === 'object') {
        partialSchemaValidation(
          answer as FormValue,
          originalSchema.shape[key],
          error,
          constructedErrorPath,
          false,
          formatMessage,
        )
      }
    }
  })

  return error
}

export function validateAnswers({
  dataSchema,
  answers,
  isFullSchemaValidation,
  formatMessage,
}: {
  dataSchema: Schema
  answers: FormValue
  isFullSchemaValidation?: boolean
  formatMessage: FormatMessage
}): ValidationRecord | undefined {
  if (!isFullSchemaValidation) {
    return partialSchemaValidation(
      answers,
      dataSchema,
      undefined,
      '',
      false,
      formatMessage,
    )
  }

  // This returns FieldsErrors<FormValue> the correct return type from the resolver
  try {
    dataSchema.parse(answers)
  } catch (e) {
    return e
  }

  return undefined
}

export const buildValidationError = (
  path: string,
  index?: number,
): ((
  message: StaticText,
  field?: string,
  values?: RecordObject<unknown>,
) => AnswerValidationError) => (message, field, values) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
      values,
    }
  }

  return {
    message,
    path,
    values,
  }
}
