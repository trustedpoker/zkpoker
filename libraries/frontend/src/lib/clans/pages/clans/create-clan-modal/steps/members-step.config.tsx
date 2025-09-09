import { CreateClanRequest } from '@declarations/clans_canister/clans_canister.did';
import { CurrencyInputComponent } from '@zk-game-dao/currency';
import {
  List,
  NumberInputComponent,
  Optional,
  StepComponentProps,
  SteppedModalStep,
  SwitchInputComponent,
  UnwrapOptional,
} from '@zk-game-dao/ui';
import Big from 'big.js';
import { memo, useMemo } from 'react';

type MembersStepValues = Pick<CreateClanRequest, "minimum_level_required" | 'supported_currency' | 'joining_fee' | 'require_proof_of_humanity' | 'minimum_experience_points' | 'member_limit'>;

function ToggleList<T>({ value, onEnableChange, label, children }: {
  value?: Optional<T>;
  onEnableChange(enabled: boolean): void;
  label: string;
  children: (value: T) => React.ReactNode;
}) {
  const unwrapValue = useMemo(() => UnwrapOptional(value), [value]);
  return (
    <List label={label}>
      <SwitchInputComponent
        label="Enabled"
        checked={unwrapValue !== undefined} // This should be controlled by a state if needed 
        onChange={onEnableChange}
      />
      {unwrapValue !== undefined && children(unwrapValue)}
    </List>
  )
};

const MembersStepComponent = memo<StepComponentProps<MembersStepValues>>(({ data, patch }) => {
  return (
    <>
      <List>
        <CurrencyInputComponent
          label="Joining fee"
          currencyType={data.supported_currency ? { Real: data.supported_currency } : { Real: { ICP: null } }}
          value={data.joining_fee}
          onChange={joining_fee => patch({ joining_fee })}
        />
        <SwitchInputComponent
          label="Member limit"
          checked={UnwrapOptional(data.member_limit) !== undefined}
          onChange={(member_limit) => {
            if (member_limit) {
              patch({ member_limit: [10] }); // Default value when enabled
            } else {
              patch({ member_limit: [] });
            }
          }}
        />
        {UnwrapOptional(data.member_limit) !== undefined && (
          <NumberInputComponent
            label="Member limit"
            value={UnwrapOptional(data.member_limit)}
            onChange={(member_limit) => patch({ member_limit: [member_limit] })}
            min={1}
            max={99999999}
          />
        )}
      </List>

      <ToggleList
        value={data.minimum_level_required}
        onEnableChange={(enabled) => {
          if (enabled) {
            patch({ minimum_level_required: [0] }); // Default value when enabled
          } else {
            patch({ minimum_level_required: [] });
          }
        }}
        label="Minimum level requirement"
      >
        {(minimum_level_required) => (
          <NumberInputComponent
            label="Minimum level required"
            value={minimum_level_required}
            onChange={(minimum_level_required) => patch({ minimum_level_required: [minimum_level_required] })}
            min={0}
            max={99999999}
          />
        )}
      </ToggleList>

      <ToggleList
        value={data.minimum_experience_points}
        onEnableChange={(enabled) => {
          if (enabled) {
            patch({ minimum_experience_points: [0n] }); // Default value when enabled
          } else {
            patch({ minimum_experience_points: [] });
          }
        }}
        label="Minimum experience points requirement"
      >
        {(minimum_experience_points) => (
          <NumberInputComponent
            label="Minimum experience points"
            value={Big(minimum_experience_points.toString())}
            onChangeBigFloat={(minimum_experience_points) => patch({ minimum_experience_points: [BigInt(minimum_experience_points.toString())] })}
            min={0}
            max={99999999}
          />
        )}
      </ToggleList>

      <SwitchInputComponent
        label="Require proof of humanity"
        checked={data.require_proof_of_humanity ?? false}
        onChange={(require_proof_of_humanity) => patch({ require_proof_of_humanity })}
      />

    </>
  );
});
MembersStepComponent.displayName = "BasicsStepComponent";

export const Config: SteppedModalStep<MembersStepValues> = {
  title: "Members",
  defaultValues: {},
  Component: MembersStepComponent,
  isValid: ({ minimum_level_required, supported_currency, joining_fee, minimum_experience_points, member_limit }) => {
    if (UnwrapOptional(minimum_level_required) !== undefined && UnwrapOptional(minimum_level_required)! < 0)
      return ["Minimum level required cannot be negative"];

    if (UnwrapOptional(minimum_experience_points) !== undefined && UnwrapOptional(minimum_experience_points)! < 0n)
      return ["Minimum experience points cannot be negative"];

    if (UnwrapOptional(member_limit) !== undefined && UnwrapOptional(member_limit)! < 1)
      return ["Member limit must be at least 1"];

    if (!supported_currency) return ["Supported currency is required"];
    if (joining_fee === undefined) return ["Joining fee is required"];
    if (joining_fee < 0) return ["Joining fee cannot be negative"];
    return true;
  }
};
