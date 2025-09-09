import { useRouting } from '@/src/hooks/routing';
import { clans_index } from '@declarations/clans_index';
import { CreateClanRequest } from '@declarations/clans_index/clans_index.did';
import { useUser } from '@lib/user';
import { callActorMutation } from '@lib/utils/call-actor-mutation';
import { useMutation } from '@tanstack/react-query';
import {
  ButtonComponent,
  Modal,
  ModalFooterPortal,
  SteppedModalComponent,
  SteppedModalStep,
  TitleTextComponent,
  UserError,
  useToast,
} from '@zk-game-dao/ui';
import { memo } from 'react';

import { Config as BasicsConfig } from './steps/basics-step.config';
import { Config as MembersConfig } from './steps/members-step.config';
import { Config as SocialsConfig } from './steps/socials-step.config';

type StepsProps = CreateClanRequest;

const STEPS: SteppedModalStep<StepsProps>[] = [
  BasicsConfig,
  MembersConfig,
  SocialsConfig
];

type CreateTournamentModalProps = {
  open?: boolean;
  onCancel(): void;
  /** This value is only for debug purposes */
  initialStep?: number;
};

export const CreateClanModalComponent = memo<CreateTournamentModalProps>(
  ({ onCancel, open, initialStep = 0 }) => {
    const { user, showSignup } = useUser();
    const { push, getHref } = useRouting();
    const { addToast } = useToast();

    const mutation = useMutation({
      mutationFn: async (stepProps: StepsProps) => {

        if (!user) throw new UserError("User not found, please log in");

        console.log({ stepProps });

        return await callActorMutation(
          clans_index,
          "create_clan",
          stepProps,
          user?.users_canister_id,
          user?.principal_id,
        )
      },
      onSuccess: (clan) => {
        push(`/clans/${clan.id.toText()}`);
        addToast({
          children: "Clan created",
          ctas: [
            {
              children: "Copy link",
              onClick: () => {
                navigator.clipboard.writeText(getHref(`${window.location.origin}/tournaments/${clan.id.toText()}`));
                addToast({ children: "Link copied" });
              },
            },
          ],
        });
      },
    });

    if (!user && open) {
      return (
        <Modal title="Login to create a clan" onClose={onCancel} open={open}>
          <TitleTextComponent
            text="Login to your account to create a clan."
          />
          <ModalFooterPortal>
            <ButtonComponent onClick={onCancel} variant="naked">
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={showSignup}>
              Login
            </ButtonComponent>
          </ModalFooterPortal>
        </Modal>
      );
    }

    return (
      <SteppedModalComponent
        steps={STEPS}
        onClose={onCancel}
        initialStep={initialStep}
        open={open}
        {...mutation}
      />
    );
  },
);
CreateClanModalComponent.displayName = 'CreateClanModalComponent';
