import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import agencyLogo from '../../assets/card/agency-logo.png'
import danger from '../../../../island-ui/src/assets/card/danger.png'
import success from '../../../../island-ui/src/assets/card/checkmark.png'
import backgroundPink from '../../../../island-ui/src/assets/card/okuskirteini.png'
import backgroundBlue from '../../../../island-ui/src/assets/card/skotvopnaleyfi.png'
import { useIntl } from 'react-intl'
import { font } from '../../utils'

const Host = styled.View`
  border-radius: 16px;
  margin-bottom: 32px;
  overflow: hidden;
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 24px 24px 14px 24px;
`

const Subtitle = styled.View`
  flex-direction: row;
  align-items: center;
`

const SubtitleIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  overflow: hidden;
  margin-left: -3px;
`

const SubtitleImage = styled.Image`
  margin-top: -2px;
`

const SubtitleText = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
  })}
`

const Detail = styled.View`
  flex: 1;
`

const Title = styled.Text`
  margin-bottom: 4px;
  ${font({
    fontWeight: '600',
    color: '#000',
  })}
`

const Logo = styled.Image`
  width: 62px;
  height: 62px;
  margin-top: -8px;
`

const Content = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  padding-top: 0px;
`

const ErrorContent = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  padding-top: 20px;
`

const Splitter = styled.View`
  height: 1px;
  margin-right: 24px;
  margin-left: 24px;
  margin-bottom: 20px;
  background-color: rgba(98, 80, 88, 1);
  opacity: 0.1;
`

const Label = styled.Text`
  ${font({
    fontSize: 12,
    color: '#8D6679',
  })}
  margin-bottom: 8px;
`

const Value = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
  })}
`

const LabelGroup = styled.View`
  margin-bottom: 16px;
`

const Photo = styled.Image`
  width: 79px;
  height: 109px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  margin-right: 32px;
`

const Left = styled.View`
  flex-direction: column;
  margin-right: 16px;
  flex: 1;
`

const Placeholder = styled.View`
  background-color: white;
  border-radius: 4px;
  opacity: 0.2;
  height: 16px;
`

const Background = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #e2c4d1;
`

const Bold = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
`
const Normal = styled.Text``

const Copy = styled.Text`
  ${font({
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '300',
    color: '#000',
  })}
  margin-bottom: 8px;
`

interface ScanResultCardProps {
  loading: boolean
  error?: boolean
  valid?: boolean
  isExpired?: boolean
  errorMessage?: string
  nationalId?: string
  name?: string
  licenseNumber?: string
  photo?: string
  data?: Array<{ key: string; value: any }>
  backgroundColor?: 'pink' | 'blue'
}

export function ScanResultCard(props: ScanResultCardProps) {
  const {
    error,
    errorMessage,
    valid,
    isExpired,
    loading,
    nationalId,
    name,
    photo,
    data,
    backgroundColor = 'pink',
  } = props
  const intl = useIntl()
  const background =
    backgroundColor === 'pink' ? backgroundPink : backgroundBlue

  return (
    <Host>
      <Background source={background} resizeMode="stretch" />
      <Header>
        <Detail>
          <Title>
            {intl.formatMessage({ id: 'licenseScannerResult.title' })}
          </Title>
          <Subtitle>
            <SubtitleIcon>
              {loading ? (
                <ActivityIndicator
                  color="#0061FF"
                  animating
                  size="small"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
              ) : error ? (
                <SubtitleImage source={danger} resizeMode="contain" />
              ) : (
                <SubtitleImage source={success} resizeMode="contain" />
              )}
            </SubtitleIcon>
            <SubtitleText>
              {loading
                ? intl.formatMessage({ id: 'licenseScannerResult.loading' })
                : error
                ? intl.formatMessage({ id: 'licenseScannerResult.error' })
                : intl.formatMessage({ id: 'licenseScannerResult.valid' })}
            </SubtitleText>
          </Subtitle>
        </Detail>
        <Logo source={agencyLogo} />
      </Header>
      {error ? (
        <ErrorContent>
          <Left>
            <LabelGroup>
              <Label>
                {intl.formatMessage({
                  id: 'licenseScannerResult.errorMessage',
                })}
              </Label>
              {isExpired ? (
                <>
                  <Value style={{ marginBottom: 16 }}>{errorMessage}</Value>
                  <Copy>
                    <Bold>Android</Bold>
                    {'  '}
                    <Normal>
                      {intl.formatMessage({
                        id: 'licenseScannerResult.androidHelp',
                      })}
                    </Normal>
                  </Copy>
                  <Copy>
                    <Bold>iOS</Bold>
                    {'  '}
                    <Normal>
                      {intl.formatMessage({
                        id: 'licenseScannerResult.iosHelp',
                      })}
                    </Normal>
                  </Copy>
                </>
              ) : (
                <Value>{errorMessage}</Value>
              )}
            </LabelGroup>
          </Left>
        </ErrorContent>
      ) : (
        <>
          <Splitter />

          <Content>
            {loading ? (
              <Placeholder
                style={{ width: 79, height: 109, marginRight: 32 }}
              />
            ) : (
              photo && (
                <Photo source={{ uri: `data:image/png;base64,${photo}` }} />
              )
            )}
            <Left>
              <LabelGroup>
                <Label>
                  {intl.formatMessage({ id: 'licenseScannerResult.name' })}
                </Label>
                {loading ? (
                  <Placeholder style={{ width: 120 }} />
                ) : (
                  <Value>{name}</Value>
                )}
              </LabelGroup>
              <LabelGroup>
                <Label>
                  {intl.formatMessage({
                    id: 'licenseScannerResult.nationalId',
                  })}
                </Label>
                {loading ? (
                  <Placeholder style={{ width: 120 }} />
                ) : (
                  <Value>{nationalId ? `${nationalId?.substr(0,6)}-${nationalId?.substr(-4)}` : `---`}</Value>
                )}
              </LabelGroup>
              {data?.map(({ key, value }) => {
                return (
                  <LabelGroup key={key}>
                    <Label>{key}</Label>
                    {loading ? (
                      <Placeholder style={{ width: 120 }} />
                    ) : (
                      <Value>{value}</Value>
                    )}
                  </LabelGroup>
                )
              })}
            </Left>
          </Content>
        </>
      )}
    </Host>
  )
}
