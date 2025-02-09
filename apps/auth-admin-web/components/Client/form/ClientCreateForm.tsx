import React, { useEffect, useState } from 'react'
import ClientDTO from '../../../entities/dtos/client-dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientService } from '../../../services/ClientService'
import { Client } from './../../../entities/models/client.model'
import { TimeUtils } from './../../../utils/time.utils'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import HintBox from '../../common/HintBox'
interface Props {
  client: ClientDTO
  onNextButtonClick?: (client: ClientDTO) => void
  handleCancel?: () => void
}

interface FormOutput {
  client: ClientDTO
  baseUrl: string
}

const ClientCreateForm: React.FC<Props> = (props: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    clearErrors,
  } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [show, setShow] = useState(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [clientIdLength, setClientIdLength] = useState<number>(0)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [clientTypeSelected, setClientTypeSelected] = useState<boolean>(false)
  const [clientTypeInfo, setClientTypeInfo] = useState<JSX.Element>(<div></div>)
  const [client, setClient] = useState<ClientDTO>(props.client)
  const [callbackUri, setCallbackUri] = useState('')
  const [showClientTypeInfo, setShowClientTypeInfo] = useState<boolean>(false)
  const [showBaseUrlInfo, setShowBaseUrlInfo] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientCreateForm'),
  )
  const [baseUrlRequired, setBaseUrlRequired] = useState<boolean>(true)
  //#region hintbox
  const [clientIdHintVisible, setClientIdHintVisible] = useState<boolean>(false)
  const [clientIdIsValid, setClientIdIsValid] = useState<boolean | null>(null)
  const [clientIdHintMessage, setClientIdHintMessage] = useState<string>('')
  //#endregion hintbox

  const onClientIdChange = async (name: string) => {
    if (isEditing) {
      return
    }
    setClientIdHintVisible(true)
    const isValid =
      name.length > 0 ? ValidationUtils.validateClientId(name) : false
    setClientIdIsValid(isValid)
    isValid
      ? setClientIdHintMessage(localization.fields['clientId'].hintOkMessage)
      : setClientIdHintMessage(localization.fields['clientId'].hintErrorMessage)

    checkAvailability(name)
  }

  const castToNumbers = (obj: ClientDTO): ClientDTO => {
    obj.absoluteRefreshTokenLifetime = +obj.absoluteRefreshTokenLifetime
    obj.accessTokenLifetime = +obj.accessTokenLifetime
    obj.authorizationCodeLifetime = +obj.authorizationCodeLifetime
    obj.deviceCodeLifetime = +obj.deviceCodeLifetime
    obj.refreshTokenExpiration = +obj.refreshTokenExpiration
    obj.refreshTokenUsage = +obj.refreshTokenUsage
    obj.slidingRefreshTokenLifetime = +obj.slidingRefreshTokenLifetime
    obj.identityTokenLifetime = +obj.identityTokenLifetime
    obj.accessTokenType = +obj.accessTokenType

    if (!obj.consentLifetime) {
      obj.consentLifetime = null
    } else {
      obj.consentLifetime = +obj.consentLifetime
    }

    if (!obj.userSsoLifetime) {
      obj.userSsoLifetime = null
    } else {
      obj.userSsoLifetime = +obj.userSsoLifetime
    }

    return obj
  }

  const hideClientInfo = async () => {
    await TimeUtils.delay(1000)
    setShowClientTypeInfo(false)
  }

  useEffect(() => {
    if (props.client && props.client.clientId) {
      setIsEditing(true)
      setAvailable(true)
      setClientTypeSelected(true)
      manageBaseUrlValidation(false)
    } else {
      setClientTypeInfo(getClientTypeHTML(''))
    }
    setClient({ ...props.client })
  }, [props.client])

  const manageBaseUrlValidation = (shouldValidate: boolean) => {
    setBaseUrlRequired(shouldValidate)
    if (!shouldValidate) {
      clearErrors('baseUrl')
    }
  }

  const create = async (data: ClientDTO): Promise<Client | null> => {
    const response = await ClientService.create(data)
    if (response) {
      if (props.onNextButtonClick) {
        props.onNextButtonClick(data)
      }
      return response
    }
    return null
  }

  const edit = async (data: ClientDTO): Promise<Client> => {
    // We delete the client id in the service. That's why we do a deep copy
    const handleObject = { ...data }
    const response = await ClientService.update(data, props.client.clientId)

    if (response) {
      if (props.onNextButtonClick) {
        props.onNextButtonClick(handleObject)
      }
    }
    return response
  }

  const save = async (data: FormOutput) => {
    const clientObject = castToNumbers(data.client)
    if (!isEditing) {
      const savedClient = await create(clientObject)
      if (savedClient) {
        ClientService.setDefaults(savedClient, data.baseUrl)
      }
    } else {
      const savedClient = await edit(clientObject)

      if (baseUrlRequired) {
        if (savedClient.redirectUris?.length > 0) {
          ClientService.setDefaults(savedClient, data.baseUrl)
        }
      }
    }
  }

  const checkAvailability = async (clientId: string) => {
    setClientIdLength(clientId?.length)
    if (!clientId) {
      return
    }

    const response = await ClientService.findClientById(clientId)
    if (response) {
      setAvailable(false)
    } else {
      setAvailable(true)
    }
  }

  const getClientTypeHTML = (clientType): JSX.Element => {
    return (
      <div className="detail-container">
        <div className="detail-title">
          {
            localization.fields['clientType'].selectItems[clientType]
              .selectItemText
          }
        </div>
        <div
          className={`detail-flow${
            localization.fields['clientType'].selectItems[clientType].flow
              ? ' show'
              : ' hidden'
          }`}
        >
          {localization.fields['clientType'].selectItems[clientType].flow}
        </div>
        <div className="detail-description">
          {localization.fields['clientType'].selectItems[clientType].helpText}
        </div>
      </div>
    )
  }

  const setClientType = async (clientType: string) => {
    let baseUrlShouldValidate = true

    // User is editing and the Client type is not changing from Machine
    if (isEditing && props.client.clientType !== 'machine') {
      baseUrlShouldValidate = false
    }

    if (clientType) {
      if (clientType === 'spa' || clientType === 'native') {
        setValue('client.requireClientSecret', false)
        setValue('client.requirePkce', true)
      }

      if (clientType === 'web' || clientType === 'machine') {
        setValue('client.requireClientSecret', true)
        setValue('client.requirePkce', false)

        if (clientType === 'machine') {
          baseUrlShouldValidate = false
        }
      }

      setClientTypeInfo(getClientTypeHTML(clientType))
      setClientTypeSelected(true)
    } else {
      setClientTypeInfo(getClientTypeHTML(''))
      setClientTypeSelected(false)
    }
    manageBaseUrlValidation(baseUrlShouldValidate)
  }

  return (
    <div className="client">
      <div className="client__wrapper">
        <div className="client__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="client__container__form">
            <div className="client__help">{localization.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="client__container__fields">
                <div className={clientTypeSelected ? '' : 'field-with-details'}>
                  <div className="client__container__field">
                    <label
                      className="client__label"
                      htmlFor="client.clientType"
                    >
                      {localization.fields['clientType'].label}
                    </label>
                    <select
                      id="client.clientType"
                      name="client.clientType"
                      ref={register({ required: true })}
                      title={localization.fields['clientType'].helpText}
                      onChange={(e) => setClientType(e.target.value)}
                      onFocus={() => setShowClientTypeInfo(true)}
                      onBlur={hideClientInfo}
                    >
                      <option value="" selected={!client.clientType}>
                        {
                          localization.fields['clientType'].selectItems['']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="spa"
                        selected={client.clientType === 'spa'}
                      >
                        {
                          localization.fields['clientType'].selectItems['spa']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="native"
                        selected={client.clientType === 'native'}
                      >
                        {
                          localization.fields['clientType'].selectItems[
                            'native'
                          ].selectItemText
                        }
                      </option>
                      <option
                        value="web"
                        selected={client.clientType === 'web'}
                      >
                        {
                          localization.fields['clientType'].selectItems['web']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="machine"
                        selected={client.clientType === 'machine'}
                      >
                        {
                          localization.fields['clientType'].selectItems[
                            'machine'
                          ].selectItemText
                        }
                      </option>
                      <option
                        value="device"
                        selected={client.clientType === 'device'}
                        disabled
                      >
                        {
                          localization.fields['clientType'].selectItems[
                            'device'
                          ].selectItemText
                        }
                      </option>
                    </select>

                    <HelpBox
                      helpText={localization.fields['clientType'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientType"
                      message={localization.fields['clientType'].errorMessage}
                    />
                    <div
                      className={`client__container__field__details${
                        showClientTypeInfo ? ' show' : ' hidden'
                      }`}
                    >
                      {clientTypeInfo}
                    </div>
                  </div>
                </div>

                <div className={clientTypeSelected ? '' : 'hidden'}>
                  <div className="client__container__field">
                    <label className="client__label" htmlFor="nationalId">
                      {localization.fields['nationalId'].label}
                    </label>
                    <input
                      id="nationalId"
                      type="text"
                      name="client.nationalId"
                      ref={register({
                        required: true,
                        maxLength: 10,
                        minLength: 10,
                        validate: ValidationUtils.validateNationalId,
                      })}
                      defaultValue={client.nationalId}
                      className="client__input"
                      placeholder={
                        localization.fields['nationalId'].placeholder
                      }
                      maxLength={10}
                      title={localization.fields['nationalId'].helpText}
                    />
                    <HelpBox
                      helpText={localization.fields['nationalId'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.nationalId"
                      message={localization.fields['nationalId'].errorMessage}
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label" htmlFor="contactEmail">
                      {localization.fields['contactEmail'].label}
                    </label>
                    <input
                      id="contactEmail"
                      type="text"
                      ref={register({
                        required: true,
                        validate: ValidationUtils.validateEmail,
                      })}
                      name="client.contactEmail"
                      defaultValue={client.contactEmail ?? ''}
                      className="client__input"
                      title={localization.fields['contactEmail'].helpText}
                      placeholder={
                        localization.fields['contactEmail'].placeholder
                      }
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.contactEmail"
                      message={localization.fields['contactEmail'].errorMessage}
                    />
                    <HelpBox
                      helpText={localization.fields['contactEmail'].helpText}
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label" htmlFor="clientId">
                      {localization.fields['clientId'].label}
                    </label>
                    <input
                      id="clientId"
                      type="text"
                      name="client.clientId"
                      ref={register({
                        required: true,
                        validate: isEditing
                          ? () => {
                              return true
                            }
                          : ValidationUtils.validateClientId,
                      })}
                      defaultValue={client.clientId}
                      className="client__input"
                      placeholder={localization.fields['clientId'].placeholder}
                      onChange={(e) => onClientIdChange(e.target.value)}
                      title={localization.fields['clientId'].helpText}
                      readOnly={isEditing}
                      onBlur={() => setClientIdHintVisible(false)}
                      onFocus={(e) => onClientIdChange(e.target.value)}
                    />
                    <div
                      className={`client__container__field__available ${
                        available ? 'ok ' : 'taken '
                      } ${clientIdLength > 0 ? 'show' : 'hidden'}`}
                    >
                      {available
                        ? localization.fields['clientId'].available
                        : localization.fields['clientId'].unAvailable}
                    </div>
                    <HintBox
                      helpText={clientIdHintMessage}
                      pattern={localization.fields['clientId'].pattern}
                      patternText={localization.fields['clientId'].patternText}
                      setVisible={clientIdHintVisible}
                      onVisibleChange={(e) => setClientIdHintVisible(e)}
                      isValid={clientIdIsValid}
                    />
                    <HelpBox
                      helpText={localization.fields['clientId'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientId"
                      message={localization.fields['clientId'].errorMessage}
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label" htmlFor="description">
                      {localization.fields['description'].label}
                    </label>
                    <input
                      type="text"
                      ref={register({
                        validate: ValidationUtils.validateDescription,
                      })}
                      name="client.description"
                      defaultValue={client.description ?? ''}
                      className="client__input"
                      title={localization.fields['description'].helpText}
                      placeholder={
                        localization.fields['description'].placeholder
                      }
                    />
                    <HelpBox
                      helpText={localization.fields['description'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.description"
                      message={localization.fields['description'].errorMessage}
                    />
                  </div>

                  <div>
                    <div className="client__container__field">
                      <label className="client__label" htmlFor="baseUrl">
                        {localization.fields['baseUrl'].label}
                      </label>

                      <input
                        id="baseUrl"
                        readOnly={isEditing && !baseUrlRequired}
                        name="baseUrl"
                        type="text"
                        ref={register({
                          required: baseUrlRequired,
                          validate: ValidationUtils.validateBaseUrl,
                        })}
                        defaultValue={client.clientUri ?? ''}
                        className="client__input"
                        placeholder={localization.fields['baseUrl'].placeholder}
                        title={localization.fields['baseUrl'].helpText}
                        onChange={(e) => setCallbackUri(e.target.value)}
                        onFocus={() => setShowBaseUrlInfo(true)}
                        onBlur={() => setShowBaseUrlInfo(false)}
                      />
                      <HelpBox
                        helpText={localization.fields['baseUrl'].helpText}
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="baseUrl"
                        message={localization.fields['baseUrl'].helpText}
                      />
                      <div
                        className={`client__container__field__details
                          ${showBaseUrlInfo ? ' show' : ' hidden'}`}
                      >
                        <div className="detail-title">
                          {localization.fields['baseUrl'].popUpTitle}
                        </div>
                        <div className="detail-uri">
                          {callbackUri}/signin-oidc
                        </div>
                        <div className="detail-link">
                          {localization.fields['baseUrl'].popUpDescription}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="client__container__field">
                    <label className="client__label" htmlFor="clientName">
                      {localization.fields['clientName'].label}
                    </label>
                    <input
                      id="clientName"
                      type="text"
                      name="client.clientName"
                      ref={register({
                        validate: ValidationUtils.validateDescription,
                      })}
                      defaultValue={client.clientName ?? ''}
                      className="client__input"
                      title={localization.fields['clientName'].helpText}
                      placeholder={
                        localization.fields['clientName'].placeholder
                      }
                    />
                    <HelpBox
                      helpText={localization.fields['clientName'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientName"
                      message={localization.fields['clientName'].errorMessage}
                    />
                    <TranslationCreateFormDropdown
                      className="client"
                      property="clientName"
                      isEditing={isEditing}
                      id={client.clientId}
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label" htmlFor="clientUri">
                      {localization.fields['clientUri'].label}
                    </label>
                    <input
                      id="clientUri"
                      name="client.clientUri"
                      ref={register({ validate: ValidationUtils.validateUrl })}
                      type="text"
                      defaultValue={client.clientUri ?? ''}
                      className="client__input"
                      placeholder={localization.fields['clientUri'].placeholder}
                      title={localization.fields['clientUri'].helpText}
                    />
                    <HelpBox
                      helpText={localization.fields['clientUri'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientUri"
                      message={localization.fields['clientUri'].errorMessage}
                    />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label" htmlFor="enabled">
                      {localization.fields['enabled'].label}
                    </label>
                    <input
                      id="enabled"
                      type="checkbox"
                      name="client.enabled"
                      className="client__checkbox"
                      defaultChecked={client.enabled}
                      ref={register}
                      title={localization.fields['enabled'].helpText}
                    ></input>
                    <HelpBox
                      helpText={localization.fields['enabled'].helpText}
                    />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label" htmlFor="requireConsent">
                      {localization.fields['requireConsent'].label}
                    </label>
                    <input
                      id="requireConsent"
                      type="checkbox"
                      defaultChecked={client.requireConsent}
                      className="client__input"
                      name="client.requireConsent"
                      ref={register}
                      title={localization.fields['requireConsent'].helpText}
                    />
                    <HelpBox
                      helpText={localization.fields['requireConsent'].helpText}
                    />
                  </div>

                  <div className="client__container__button" id="advanced">
                    <button
                      type="button"
                      className="client__button__show"
                      onClick={() => setShow(!show)}
                      title={localization.buttons['advanced'].helpText}
                    >
                      <i className="client__button__show__icon"></i>
                      {localization.buttons['advanced'].text}
                    </button>
                  </div>

                  <div
                    className={`client__container__advanced ${
                      show === true ? 'show' : 'hidden'
                    }`}
                  >
                    <section className="client_section">
                      <h3>{localization.sections['delegations'].title}</h3>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsDelegation"
                        >
                          {localization.fields['supportsDelegation'].label}
                        </label>
                        <input
                          id="supportsDelegation"
                          type="checkbox"
                          name="client.supportsDelegation"
                          defaultChecked={client.supportsDelegation}
                          className="client__input"
                          ref={register}
                          title={
                            localization.fields['supportsDelegation'].helpText
                          }
                        />
                        <HelpBox
                          helpText={
                            localization.fields['supportsDelegation'].helpText
                          }
                        />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsLegalGuardians"
                        >
                          {localization.fields['supportsLegalGuardians'].label}
                        </label>
                        <input
                          id="supportsLegalGuardians"
                          type="checkbox"
                          name="client.supportsLegalGuardians"
                          defaultChecked={client.supportsLegalGuardians}
                          className="client__input"
                          ref={register}
                          title={
                            localization.fields['supportsLegalGuardians']
                              .helpText
                          }
                        />
                        <HelpBox
                          helpText={
                            localization.fields['supportsLegalGuardians']
                              .helpText
                          }
                        />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsPersonalRepresentatives"
                        >
                          {
                            localization.fields[
                              'supportsPersonalRepresentatives'
                            ].label
                          }
                        </label>
                        <input
                          id="supportsPersonalRepresentatives"
                          type="checkbox"
                          name="client.supportsPersonalRepresentatives"
                          defaultChecked={
                            client.supportsPersonalRepresentatives
                          }
                          className="client__input"
                          ref={register}
                          title={
                            localization.fields[
                              'supportsPersonalRepresentatives'
                            ].helpText
                          }
                        />
                        <HelpBox
                          helpText={
                            localization.fields[
                              'supportsPersonalRepresentatives'
                            ].helpText
                          }
                        />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsProcuringHolders"
                        >
                          {
                            localization.fields['supportsProcuringHolders']
                              .label
                          }
                        </label>
                        <input
                          id="supportsProcuringHolders"
                          type="checkbox"
                          name="client.supportsProcuringHolders"
                          defaultChecked={client.supportsProcuringHolders}
                          className="client__input"
                          ref={register}
                          title={
                            localization.fields['supportsProcuringHolders']
                              .helpText
                          }
                        />
                        <HelpBox
                          helpText={
                            localization.fields['supportsProcuringHolders']
                              .helpText
                          }
                        />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="promptDelegations"
                        >
                          {localization.fields['promptDelegations'].label}
                        </label>
                        <input
                          id="promptDelegations"
                          type="checkbox"
                          name="client.promptDelegations"
                          defaultChecked={client.promptDelegations}
                          className="client__input"
                          ref={register}
                          title={
                            localization.fields['promptDelegations'].helpText
                          }
                        />
                        <HelpBox
                          helpText={
                            localization.fields['promptDelegations'].helpText
                          }
                        />
                      </div>
                    </section>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['frontChannelLogoutUri'].label}
                      </label>
                      <input
                        type="text"
                        name="client.frontChannelLogoutUri"
                        defaultValue={client.frontChannelLogoutUri ?? ''}
                        className="client__input"
                        placeholder={
                          localization.fields['frontChannelLogoutUri']
                            .placeholder
                        }
                        title={
                          localization.fields['frontChannelLogoutUri'].helpText
                        }
                        ref={register({
                          required: false,
                          validate: ValidationUtils.validateUrl,
                        })}
                      />
                      <HelpBox
                        helpText={
                          localization.fields['frontChannelLogoutUri'].helpText
                        }
                        helpLinkText="See the OIDC Connect Session Management spec for more details."
                        helpLink="https://openid.net/specs/openid-connect-session-1_0.html"
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.frontChannelLogoutUri"
                        message={
                          localization.fields['frontChannelLogoutUri']
                            .errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['pairWiseSubjectSalt'].label}
                      </label>
                      <input
                        type="text"
                        defaultValue={client.pairWiseSubjectSalt ?? ''}
                        className="client__input"
                        name="client.pairWiseSubjectSalt"
                        ref={register}
                        title={
                          localization.fields['pairWiseSubjectSalt'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['pairWiseSubjectSalt'].helpText
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['userCodeType'].label}
                      </label>
                      <input
                        type="text"
                        defaultValue={client.userCodeType ?? ''}
                        name="client.userCodeType"
                        className="client__input"
                        ref={register}
                        title={localization.fields['userCodeType'].helpText}
                      />
                      <HelpBox
                        helpText={localization.fields['userCodeType'].helpText}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['accessTokenType'].label}
                      </label>
                      <select
                        name="client.accessTokenType"
                        className="client__select"
                        ref={register({ required: true })}
                        title={localization.fields['accessTokenType'].helpText}
                      >
                        <option
                          value={0}
                          selected={client.accessTokenType === 0}
                        >
                          JWT
                        </option>
                        <option
                          value={1}
                          selected={client.accessTokenType === 1}
                        >
                          Reference
                        </option>
                      </select>
                      <HelpBox
                        helpText={
                          localization.fields['accessTokenType'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.accessTokenType"
                        message={
                          localization.fields['accessTokenType'].errorMessage
                        }
                      />
                    </div>

                    {/* Number inputs */}
                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['accessTokenLifetime'].label}
                      </label>

                      <input
                        ref={register({ required: true, min: 0 })}
                        type="number"
                        name="client.accessTokenLifetime"
                        defaultValue={client.accessTokenLifetime}
                        className="client__input"
                        title={
                          localization.fields['accessTokenLifetime'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['accessTokenLifetime'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.accessTokenLifetime"
                        message={
                          localization.fields['accessTokenLifetime']
                            .errorMessage
                        }
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['authorizationCodeLifetime'].label}
                      </label>
                      <input
                        type="number"
                        name="client.authorizationCodeLifetime"
                        defaultValue={client.authorizationCodeLifetime}
                        ref={register({ required: true, min: 0 })}
                        className="client__input"
                        title={
                          localization.fields['authorizationCodeLifetime']
                            .helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['authorizationCodeLifetime']
                            .helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.authorizationCodeLifetime"
                        message={
                          localization.fields['authorizationCodeLifetime']
                            .errorMessage
                        }
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['consentLifetime'].label}
                      </label>
                      <input
                        type="number"
                        name="client.consentLifetime"
                        defaultValue={client.consentLifetime ?? ''}
                        className="client__input"
                        ref={register({ min: 0 })}
                        title={localization.fields['consentLifetime'].helpText}
                      />
                      <HelpBox
                        helpText={
                          localization.fields['consentLifetime'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.consentLifetime"
                        message={
                          localization.fields['consentLifetime'].errorMessage
                        }
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['deviceCodeLifetime'].label}
                      </label>
                      <input
                        type="number"
                        ref={register({ required: true, min: 0 })}
                        name="client.deviceCodeLifetime"
                        defaultValue={client.deviceCodeLifetime}
                        className="client__input"
                        title={
                          localization.fields['deviceCodeLifetime'].helpText
                        }
                        placeholder={
                          localization.fields['deviceCodeLifetime'].placeholder
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['deviceCodeLifetime'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.deviceCodeLifetime"
                        message={
                          localization.fields['deviceCodeLifetime'].errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['userSsoLifetime'].label}
                      </label>
                      <input
                        type="number"
                        defaultValue={client.userSsoLifetime ?? ''}
                        name="client.userSsoLifetime"
                        className="client__input"
                        ref={register({ min: 0 })}
                        title={localization.fields['userSsoLifetime'].helpText}
                      />
                      <HelpBox
                        helpText={
                          localization.fields['userSsoLifetime'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.userSsoLifetime"
                        message={
                          localization.fields['userSsoLifetime'].errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['refreshTokenUsage'].label}
                      </label>
                      <select
                        name="client.refreshTokenUsage"
                        className="client__select"
                        ref={register({ required: true })}
                        title={
                          localization.fields['refreshTokenUsage'].helpText
                        }
                      >
                        <option
                          value={0}
                          selected={client.refreshTokenUsage === 0}
                        >
                          ReUse
                        </option>
                        <option
                          value={1}
                          selected={client.refreshTokenUsage === 1}
                        >
                          OneTime
                        </option>
                      </select>
                      <HelpBox
                        helpText={
                          localization.fields['refreshTokenUsage'].helpText
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['refreshTokenExpiration'].label}
                      </label>
                      <select
                        name="client.refreshTokenExpiration"
                        className="client__select"
                        ref={register({ required: true })}
                        title={
                          localization.fields['refreshTokenExpiration'].helpText
                        }
                      >
                        <option
                          value={0}
                          selected={client.refreshTokenExpiration === 0}
                        >
                          Sliding
                        </option>
                        <option
                          value={1}
                          selected={client.refreshTokenExpiration === 1}
                        >
                          Absolute
                        </option>
                      </select>
                      <HelpBox
                        helpText={
                          localization.fields['refreshTokenExpiration'].helpText
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {
                          localization.fields['slidingRefreshTokenLifetime']
                            .label
                        }
                      </label>
                      <input
                        type="number"
                        defaultValue={client.slidingRefreshTokenLifetime}
                        name="client.slidingRefreshTokenLifetime"
                        className="client__input"
                        ref={register({ min: 0 })}
                        title={
                          localization.fields['slidingRefreshTokenLifetime']
                            .helpText
                        }
                        placeholder={
                          localization.fields['slidingRefreshTokenLifetime']
                            .placeholder
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['slidingRefreshTokenLifetime']
                            .helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.slidingRefreshTokenLifetime"
                        message={
                          localization.fields['slidingRefreshTokenLifetime']
                            .errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {
                          localization.fields['absoluteRefreshTokenLifetime']
                            .label
                        }
                      </label>
                      <input
                        type="number"
                        ref={register({ required: true, min: 0 })}
                        name="client.absoluteRefreshTokenLifetime"
                        defaultValue={client.absoluteRefreshTokenLifetime}
                        className="client__input"
                        title={
                          localization.fields['absoluteRefreshTokenLifetime']
                            .helpText
                        }
                        placeholder={
                          localization.fields['absoluteRefreshTokenLifetime']
                            .placeholder
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['absoluteRefreshTokenLifetime']
                            .helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.absoluteRefreshTokenLifetime"
                        message={
                          localization.fields['identityTokenLifetime']
                            .errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['identityTokenLifetime'].label}
                      </label>
                      <input
                        type="number"
                        name="client.identityTokenLifetime"
                        defaultValue={client.identityTokenLifetime}
                        ref={register({ required: true, min: 0 })}
                        className="client__input"
                        title={
                          localization.fields['identityTokenLifetime'].helpText
                        }
                        placeholder={
                          localization.fields['identityTokenLifetime']
                            .placeholder
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['identityTokenLifetime'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.identityTokenLifetime"
                        message={
                          localization.fields['identityTokenLifetime']
                            .errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['protocolType'].label}
                      </label>
                      <input
                        ref={register({ required: true, min: 0 })}
                        type="text"
                        name="client.protocolType"
                        defaultValue={
                          client.protocolType ? client.protocolType : 'oidc'
                        }
                        className="client__input"
                        placeholder={
                          localization.fields['protocolType'].placeholder
                        }
                        title={localization.fields['protocolType'].helpText}
                      />
                      <HelpBox
                        helpText={localization.fields['protocolType'].helpText}
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.protocolType"
                        message={
                          localization.fields['protocolType'].errorMessage
                        }
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        {localization.fields['clientClaimsPrefix'].label}
                      </label>
                      <input
                        ref={register}
                        type="text"
                        name="client.clientClaimsPrefix"
                        defaultValue={
                          client.clientClaimsPrefix
                            ? client.clientClaimsPrefix
                            : 'client__'
                        }
                        className="client__input"
                        placeholder={
                          localization.fields['clientClaimsPrefix'].placeholder
                        }
                        title={
                          localization.fields['clientClaimsPrefix'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['clientClaimsPrefix'].helpText
                        }
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.clientClaimsPrefix"
                        message={
                          localization.fields['clientClaimsPrefix'].errorMessage
                        }
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {
                          localization.fields['allowAccessTokenViaBrowser']
                            .label
                        }
                      </label>
                      <input
                        type="checkbox"
                        name="client.allowAccessTokenViaBrowser"
                        defaultChecked={client.allowAccessTokenViaBrowser}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields['allowAccessTokenViaBrowser']
                            .helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['allowAccessTokenViaBrowser']
                            .helpText
                        }
                      />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['allowOfflineAccess'].label}
                      </label>
                      <input
                        name="client.allowOfflineAccess"
                        type="checkbox"
                        defaultChecked={client.allowOfflineAccess}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields['allowOfflineAccess'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['allowOfflineAccess'].helpText
                        }
                      />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['allowPlainTextPkce'].label}
                      </label>
                      <input
                        name="client.allowPlainTextPkce"
                        type="checkbox"
                        defaultChecked={client.allowPlainTextPkce}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields['allowPlainTextPkce'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['allowPlainTextPkce'].helpText
                        }
                      />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['allowRememberConsent'].label}
                      </label>
                      <input
                        name="client.allowRememberConsent"
                        type="checkbox"
                        defaultChecked={client.allowRememberConsent}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields['allowRememberConsent'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['allowRememberConsent'].helpText
                        }
                      />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {
                          localization.fields[
                            'alwaysIncludeUserClaimsInIdToken'
                          ].label
                        }
                      </label>
                      <input
                        type="checkbox"
                        name="client.alwaysIncludeUserClaimsInIdToken"
                        defaultChecked={client.alwaysIncludeUserClaimsInIdToken}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields[
                            'alwaysIncludeUserClaimsInIdToken'
                          ].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields[
                            'alwaysIncludeUserClaimsInIdToken'
                          ].helpText
                        }
                      />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['alwaysSendClientClaims'].label}
                      </label>
                      <input
                        type="checkbox"
                        name="client.alwaysSendClientClaims"
                        defaultChecked={client.alwaysSendClientClaims}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields['alwaysSendClientClaims'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['alwaysSendClientClaims'].helpText
                        }
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {
                          localization.fields[
                            'backChannelLogoutSessionRequired'
                          ].label
                        }
                      </label>
                      <input
                        type="checkbox"
                        name="client.backChannelLogoutSessionRequired"
                        defaultChecked={client.backChannelLogoutSessionRequired}
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields[
                            'backChannelLogoutSessionRequired'
                          ].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields[
                            'backChannelLogoutSessionRequired'
                          ].helpText
                        }
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['enableLocalLogin'].helpText}
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.enableLocalLogin}
                        className="client__input"
                        name="client.enableLocalLogin"
                        ref={register}
                        title={localization.fields['enableLocalLogin'].helpText}
                      />
                      <HelpBox
                        helpText={
                          localization.fields['enableLocalLogin'].helpText
                        }
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {
                          localization.fields[
                            'frontChannelLogoutSessionRequired'
                          ].label
                        }
                      </label>
                      <input
                        type="checkbox"
                        name="client.frontChannelLogoutSessionRequired"
                        defaultChecked={
                          client.frontChannelLogoutSessionRequired
                        }
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields[
                            'frontChannelLogoutSessionRequired'
                          ].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields[
                            'frontChannelLogoutSessionRequired'
                          ].helpText
                        }
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['includeJwtId'].label}
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.includeJwtId}
                        className="client__input"
                        name="client.includeJwtId"
                        ref={register}
                        title={localization.fields['includeJwtId'].helpText}
                      />
                      <HelpBox
                        helpText={localization.fields['includeJwtId'].helpText}
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['requireClientSecret'].label}
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requireClientSecret}
                        className="client__input"
                        name="client.requireClientSecret"
                        ref={register}
                        title={
                          localization.fields['requireClientSecret'].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields['requireClientSecret'].helpText
                        }
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {localization.fields['requirePkce'].label}
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requirePkce}
                        name="client.requirePkce"
                        className="client__input"
                        ref={register}
                        title={localization.fields['requirePkce'].helpText}
                      />
                      <HelpBox
                        helpText={localization.fields['requirePkce'].helpText}
                      />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        {
                          localization.fields[
                            'updateAccessTokenClaimsOnRefresh'
                          ].label
                        }
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.updateAccessTokenClaimsOnRefresh}
                        name="client.updateAccessTokenClaimsOnRefresh"
                        className="client__input"
                        ref={register}
                        title={
                          localization.fields[
                            'updateAccessTokenClaimsOnRefresh'
                          ].helpText
                        }
                      />
                      <HelpBox
                        helpText={
                          localization.fields[
                            'updateAccessTokenClaimsOnRefresh'
                          ].helpText
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="client__buttons__container">
                <div className="client__button__container">
                  <button
                    className="client__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="client__button__container">
                  <input
                    type="submit"
                    className="client__button__save"
                    disabled={isSubmitting || !available}
                    title={localization.buttons['save'].helpText}
                    value={localization.buttons['save'].text}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ClientCreateForm
