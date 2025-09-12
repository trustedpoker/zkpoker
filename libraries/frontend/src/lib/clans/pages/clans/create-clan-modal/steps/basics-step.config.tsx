import { CreateClanRequest } from '@declarations/clans_canister/clans_canister.did';
import { RealCurrencyInputComponent } from '@zk-game-dao/currency';
import { DropdownInputComponent, List, StepComponentProps, SteppedModalStep, TextInputComponent } from '@zk-game-dao/ui';
import { memo } from 'react';

import { matchRustEnum } from '../../../../../utils/rust';

type BasicsStepValues = Pick<CreateClanRequest, "name" | "tag" | 'description' | 'avatar' | 'supported_currency' | 'privacy'>;

const BasicsStepComponent = memo<StepComponentProps<BasicsStepValues>>(({ data, patch }) => {

  return (
    <>
      <List>
        <TextInputComponent
          label="Name"
          value={data.name}
          onChange={(name) => patch({ name })}
        />
        <TextInputComponent
          label="Description"
          value={data.description}
          onChange={(description) => patch({ description })}
        />
        <TextInputComponent
          label="Tag"
          value={data.description}
          onChange={(description) => patch({ description })}
        />
      </List>


      <List label="Settings">
        <RealCurrencyInputComponent
          label={<>Token</>}
          value={data.supported_currency}
          onChange={(supported_currency) => patch({ supported_currency })}
        />
        <DropdownInputComponent
          label="Privacy"
          value={matchRustEnum(data.privacy ?? { Public: null })({
            Public: () => "Public",
            Application: () => "Application",
            InviteOnly: () => "InviteOnly",
          })}
          onChange={(privacy) => {
            switch (privacy) {
              case "Public":
                patch({ privacy: { Public: null } });
                break;
              case "Application":
                patch({ privacy: { Application: null } });
                break;
              case "InviteOnly":
                patch({ privacy: { InviteOnly: null } });
                break;
              default:
                patch({ privacy: { Public: null } });
                break;
            }
          }}
          options={[
            { value: "Public", label: "Public" },
            { value: "Application", label: "Application" },
            { value: "InviteOnly", label: "Invite Only" },
          ]}
        />
      </List>

    </>
  );
});
BasicsStepComponent.displayName = "BasicsStepComponent";

export const Config: SteppedModalStep<BasicsStepValues> = {
  title: "The basics",
  defaultValues: {
    avatar: [],
  },
  Component: BasicsStepComponent,
  isValid: ({ name, tag, description, supported_currency, privacy }) => {
    if (!name) return ["Name is required"];
    if (name.length < 3) return ["Name must be at least 3 characters long"];
    if (name.length > 180) return ["Name must be at most 180 characters long"];

    if (!description) return ["Description is required"];
    if (description.length < 3) return ["Description must be at least 3 characters long"];
    if (description.length > 1000) return ["Description must be at most 1000 characters long"];

    if (!tag) return ["Tag is required"];
    if (tag.length < 3) return ["Tag must be at least 3 characters long"];
    if (tag.length > 20) return ["Tag must be at most 20 characters long"];

    if (!supported_currency) return ["Token is required"];

    if (!privacy) return ["Privacy is required"];

    return true;
  },
};
