import React, { useState } from 'react'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import { useFormik } from 'formik'
import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './NameSignupForm.css'
import {
  MailchimpSubscribeMutation,
  MailchimpSubscribeMutationVariables,
  MailingListSignupSlice,
  Namespace,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useMutation } from '@apollo/client/react'
import { MAILING_LIST_SIGNUP_MUTATION } from '@island.is/web/screens/queries'

interface FormProps {
  email?: string
  name?: string
  toggle?: string
}

interface MessageProps {
  type: string
  text: string
}

interface NameSignupFormProps {
  namespace: Namespace
  slice: MailingListSignupSlice
}

export const NameSignupForm = ({ namespace, slice }: NameSignupFormProps) => {
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageProps>({ type: '', text: '' })

  const n = useNamespace(namespace)

  const validate = async (values) => {
    const errors: FormProps = {}

    if (!values.name.length) {
      errors.name = 'invalid'
    }
    if (!isValidEmail.test(values.email)) {
      errors.email = 'invalid'
    }

    return errors
  }

  const [subscribeToMailchimp] = useMutation<
    MailchimpSubscribeMutation,
    MailchimpSubscribeMutationVariables
  >(MAILING_LIST_SIGNUP_MUTATION)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      toggle: 'Yes',
    },
    validateOnChange: false,
    validate,
    onSubmit: () => {
      setLoading(true)
      subscribeToMailchimp({
        variables: {
          input: {
            signupID: slice.id,
            email: formik.values.email,
            name: formik.values.name,
            toggle: formik.values.toggle === 'Yes',
          },
        },
      })
        .then((result) => {
          if (result?.data?.mailchimpSubscribe?.subscribed) {
            setMessage({
              type: 'success',
              text: n('formSuccessTitle', 'Skráning tókst, takk fyrir!'),
            })
          } else {
            setMessage({
              type: 'error',
              text: n(
                'formEmailUnknownError',
                'Óþekkt villa kom upp, reynið aftur síðar.',
              ),
            })
          }
        })
        .catch(() => {
          setMessage({
            type: 'error',
            text: n(
              'formEmailUnknownError',
              'Óþekkt villa kom upp, reynið aftur síðar.',
            ),
          })
        })
    },
  })

  return (
    <Box
      paddingY={[3, 3, 8]}
      paddingX={[3, 3, 3, 3, 15]}
      borderRadius="large"
      background="blue100"
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack space={5}>
          <GridRow>
            <GridColumn span={'12/12'} paddingBottom={message ? 0 : 3}>
              <Text as="h3" variant="h3" color="blue600">
                {slice.title}
              </Text>
            </GridColumn>
          </GridRow>
          {message.type ? (
            <GridRow>
              <GridColumn span={'12/12'}>
                <Text variant="h4" color="blue600">
                  {message.text}
                </Text>
              </GridColumn>
            </GridRow>
          ) : (
            <>
              <GridRow>
                <GridColumn span="12/12" paddingBottom={3}>
                  <Input
                    name="name"
                    label={slice.fullNameLabel}
                    required
                    errorMessage={n(
                      'formInvalidName',
                      'Þennan reit þarf að fylla út.',
                    )}
                    hasError={!!formik.errors.name}
                    defaultValue=""
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                </GridColumn>
                <GridColumn span="12/12">
                  <Input
                    name="email"
                    label={slice.inputLabel}
                    defaultValue=""
                    required
                    errorMessage={n(
                      'formInvalidEmail',
                      'Þetta er ógilt netfang.',
                    )}
                    hasError={!!formik.errors.email}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'12/12'} paddingBottom={2}>
                  <Text fontWeight="semiBold">{slice.questionLabel}</Text>
                </GridColumn>
                <GridColumn span={['12/12', '6/12']}>
                  <RadioButton
                    id="yes"
                    name="toggle"
                    value="Yes"
                    label={slice.yesLabel}
                    checked={formik.values.toggle === 'Yes'}
                    onChange={formik.handleChange}
                  />
                </GridColumn>
                <GridColumn span={['12/12', '6/12']} paddingTop={[2, 0]}>
                  <RadioButton
                    id="no"
                    name="toggle"
                    value="No"
                    label={slice.noLabel}
                    checked={formik.values.toggle === 'No'}
                    onChange={formik.handleChange}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span="12/12">
                  <Checkbox
                    label={slice.disclaimerLabel}
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'12/12'}>
                  <Box className={styles.justifyContentFlexEnd}>
                    <Button type="submit" disabled={!checked || loading}>
                      {slice.buttonText}
                    </Button>
                  </Box>
                </GridColumn>
              </GridRow>
            </>
          )}
        </Stack>
      </form>
    </Box>
  )
}
