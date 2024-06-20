import { Percent } from "@uniswap/sdk-core";
import Expand from "components/Expand";
import QuestionHelper from "components/QuestionHelper";
import Row, { RowBetween } from "components/Row";
import { Trans } from "i18n";
import { useState } from "react";
import { useUserSlippageTolerance } from "state/user/hooks";
import { SlippageTolerance } from "state/user/types";
import styled from "styled-components";
import { CautionTriangle, ThemedText } from "theme/components";
import { useFormatter } from "utils/formatNumbers";

import { Input, InputContainer } from "../Input";

enum SlippageError {
  InvalidInput = "InvalidInput",
}

const Option = styled(Row)<{ isActive: boolean }>`
  width: auto;
  cursor: pointer;
  padding: 6px 12px;
  text-align: center;
  gap: 4px;
  border-radius: 12px;
  background: ${({ isActive, theme }) =>
    isActive ? "#9657EB" : "transparent"};
  pointer-events: ${({ isActive }) => isActive && "none"};
`;

const Switch = styled(Row)`
  width: auto;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 16px;
`;

const NUMBER_WITH_MAX_TWO_DECIMAL_PLACES = /^(?:\d*\.\d{0,2}|\d+)$/;
const MINIMUM_RECOMMENDED_SLIPPAGE = new Percent(5, 10_000);
const MAXIMUM_RECOMMENDED_SLIPPAGE = new Percent(1, 100);

function useFormatPercentInput() {
  const { formatPercent } = useFormatter();

  return (slippage: Percent) => formatPercent(slippage).slice(0, -1); // remove % sign
}

export default function MaxSlippageSettings({
  autoSlippage,
}: {
  autoSlippage: Percent;
}) {
  const [userSlippageTolerance, setUserSlippageTolerance] =
    useUserSlippageTolerance();
  const { formatPercent } = useFormatter();
  const formatPercentInput = useFormatPercentInput();

  // In order to trigger `custom` mode, we need to set `userSlippageTolerance` to a value that is not `auto`.
  // To do so, we use `autoSlippage` value. However, since users are likely to change that value,
  // we render it as a placeholder instead of a value.
  const defaultSlippageInputValue =
    userSlippageTolerance !== SlippageTolerance.Auto &&
    !userSlippageTolerance.equalTo(autoSlippage)
      ? formatPercentInput(userSlippageTolerance)
      : "";

  // If user has previously entered a custom slippage, we want to show that value in the input field
  // instead of a placeholder.
  const [slippageInput, setSlippageInput] = useState(defaultSlippageInputValue);
  const [slippageError, setSlippageError] = useState<SlippageError | false>(
    false
  );

  // If user has previously entered a custom slippage, we want to show the settings expanded by default.
  const [isOpen, setIsOpen] = useState(defaultSlippageInputValue.length > 0);

  const parseSlippageInput = (value: string) => {
    // Do not allow non-numerical characters in the input field or more than two decimals
    if (value.length > 0 && !NUMBER_WITH_MAX_TWO_DECIMAL_PLACES.test(value)) {
      return;
    }

    setSlippageInput(value);
    setSlippageError(false);

    // If the input is empty, set the slippage to the default
    if (value.length === 0) {
      setUserSlippageTolerance(SlippageTolerance.Auto);
      return;
    }

    if (value === ".") {
      return;
    }

    // Parse user input and set the slippage if valid, error otherwise
    try {
      const parsed = Math.floor(Number.parseFloat(value) * 100);
      if (parsed > 5000) {
        setSlippageError(SlippageError.InvalidInput);
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000));
      }
    } catch (e) {
      setSlippageError(SlippageError.InvalidInput);
    }
  };

  const tooLow =
    userSlippageTolerance !== SlippageTolerance.Auto &&
    userSlippageTolerance.lessThan(MINIMUM_RECOMMENDED_SLIPPAGE);
  const tooHigh =
    userSlippageTolerance !== SlippageTolerance.Auto &&
    userSlippageTolerance.greaterThan(MAXIMUM_RECOMMENDED_SLIPPAGE);

  return (
    <Expand
      testId="max-slippage-settings"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      header={
        <Row width="auto">
          <div>
            <Trans>Max. slippage</Trans>
          </div>
          <QuestionHelper
            text={
              <Trans>
                Your transaction will revert if the price changes unfavorably by
                more than this percentage.
              </Trans>
            }
          />
        </Row>
      }
      button={
        <ThemedText.BodyPrimary>
          {userSlippageTolerance === SlippageTolerance.Auto ? (
            <Trans>Auto</Trans>
          ) : (
            formatPercent(userSlippageTolerance)
          )}
        </ThemedText.BodyPrimary>
      }
    >
      <RowBetween gap="md">
        <Switch>
          <Option
            onClick={() => {
              // Reset the input field when switching to auto
              setSlippageInput("");
              setUserSlippageTolerance(SlippageTolerance.Auto);
            }}
            isActive={userSlippageTolerance === SlippageTolerance.Auto}
          >
            <ThemedText.BodyPrimary>
              <Trans>Auto</Trans>
            </ThemedText.BodyPrimary>
          </Option>
          <Option
            onClick={() => {
              // When switching to custom slippage, use `auto` value as a default.
              setUserSlippageTolerance(autoSlippage);
            }}
            isActive={userSlippageTolerance !== SlippageTolerance.Auto}
          >
            <ThemedText.BodyPrimary>
              <Trans>Custom</Trans>
            </ThemedText.BodyPrimary>
          </Option>
        </Switch>
        <InputContainer
          gap="md"
          error={!!slippageError}
          backgroundColor="white"
          color="black"
        >
          <Input
            data-testid="slippage-input"
            placeholder={formatPercentInput(autoSlippage)}
            value={slippageInput}
            onChange={(e) => parseSlippageInput(e.target.value)}
            onBlur={() => {
              // When the input field is blurred, reset the input field to the default value
              setSlippageInput(defaultSlippageInputValue);
              setSlippageError(false);
            }}
            color="black"
          />
          <div>%</div>
        </InputContainer>
      </RowBetween>
      {tooLow || tooHigh ? (
        <RowBetween gap="md">
          <CautionTriangle />
          <ThemedText.BodySmall color="deprecated_accentWarning">
            {tooLow ? (
              <Trans>
                Slippage below{" "}
                {{ amt: formatPercent(MINIMUM_RECOMMENDED_SLIPPAGE) }} may
                result in a failed transaction
              </Trans>
            ) : (
              <Trans>
                Your transaction may be frontrun and result in an unfavorable
                trade.
              </Trans>
            )}
          </ThemedText.BodySmall>
        </RowBetween>
      ) : null}
    </Expand>
  );
}
