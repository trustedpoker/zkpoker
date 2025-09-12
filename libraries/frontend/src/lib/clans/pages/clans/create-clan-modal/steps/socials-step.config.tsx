import { CreateClanRequest } from '@declarations/clans_canister/clans_canister.did';
import { StepComponentProps, SteppedModalStep, TextInputComponent, UnwrapOptional } from '@zk-game-dao/ui';
import { memo } from 'react';

type SocialsStepValues = Pick<CreateClanRequest, "website" | "discord" | "twitter">;

const SocialsStepComponent = memo<StepComponentProps<SocialsStepValues>>(({ data, patch }) => {
  return (
    <>

      <TextInputComponent
        label="Website"
        value={UnwrapOptional(data.website)}
        onChange={(website) => patch({ website: website ? [website] : [] })}
      />

      <TextInputComponent
        label="Discord"
        value={UnwrapOptional(data.discord)}
        onChange={(discord) => patch({ discord: discord ? [discord] : [] })}
      />

      <TextInputComponent
        label="Twitter"
        value={UnwrapOptional(data.twitter)}
        onChange={(twitter) => patch({ twitter: twitter ? [twitter] : [] })}
      />

    </>
  );
});
SocialsStepComponent.displayName = "SocialsStepComponent";

export const Config: SteppedModalStep<SocialsStepValues> = {
  title: "Socials",
  defaultValues: {},
  Component: SocialsStepComponent,
  isValid: () => true,
};
