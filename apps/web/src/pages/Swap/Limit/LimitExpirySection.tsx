import { sendAnalyticsEvent } from 'analytics'
import Row from 'components/Row'
import { t, Trans } from 'i18n'
import { useLimitContext } from 'state/limit/LimitContext'
import { Expiry } from 'state/limit/types'
import styled from 'styled-components'
import { ClickableStyle, ThemedText } from 'theme/components'

const ExpirySection = styled(Row)`
  width: 100%;
  padding: 12px 16px;
  justify-content: space-between;
`

const LimitExpiryButton = styled.button<{ $selected: boolean }>`
  display: flex;
  padding: 4px 8px;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.surface3};
  height: 28px;
  border-radius: 999px;
  background-color: ${({ theme, $selected }) => ($selected ? "#9657EB59" : 'unset')};
  color: ${({ theme, $selected }) => ($selected ? theme.neutral1 : theme.neutral2)};
  ${ClickableStyle}
 :hover {
    border-color: #9657eb59;
  }
`;

const EXPIRY_OPTIONS = [Expiry.Day, Expiry.Week, Expiry.Month, Expiry.Year]

function getExpiryLabelText(expiry: Expiry) {
  switch (expiry) {
    case Expiry.Day:
      return t`1 day`
    case Expiry.Week:
      return t`1 week`
    case Expiry.Month:
      return t`1 month`
    case Expiry.Year:
      return t`1 year`
  }
}

export function LimitExpirySection() {
  const { limitState, setLimitState } = useLimitContext()

  return (
    <ExpirySection>
      <ThemedText.SubHeaderSmall>
        <Trans>Expiry</Trans>
      </ThemedText.SubHeaderSmall>
      <Row justify="flex-end" gap="xs">
        {EXPIRY_OPTIONS.map((expiry) => (
          <LimitExpiryButton
            key={expiry}
            $selected={expiry === limitState.expiry}
            onClick={() => {
              if (expiry === limitState.expiry) return
              sendAnalyticsEvent('Limit Expiry Selected', {
                value: expiry,
              })
              setLimitState((prev) => ({
                ...prev,
                expiry,
              }))
            }}
          >
            <ThemedText.LabelSmall color="inherit" fontWeight={535}>
              {getExpiryLabelText(expiry)}
            </ThemedText.LabelSmall>
          </LimitExpiryButton>
        ))}
      </Row>
    </ExpirySection>
  )
}
