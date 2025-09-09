import { createActor } from '@declarations/users_canister';
import { User } from '@declarations/users_canister/users_canister.did';
import {
  ButtonComponent,
  callActorMutation,
  ErrorComponent,
  Modal,
  ModalFooterPortal,
  NumberInputComponent,
  TabsInputComponent,
  TextInputComponent,
  useMutation,
} from '@zk-game-dao/ui';
import Big from 'big.js';
import { memo, useMemo, useState } from 'react';

import { Queries } from '../../data';
import { useAuth } from '@zk-game-dao/currency';

export const BanUserModalComponent = memo<{ isOpen: boolean; onClose: () => void; user: User; }>(({ isOpen, onClose, user }) => {
  const [type, setType] = useState<"xp" | "temporary" | "permanent">("xp");
  const [reason, setReason] = useState<string>();
  const [forHours, setForHours] = useState<Big>(Big(1));
  const { authData } = useAuth();

  const actor = useMemo(() => {
    if (!user.users_canister_id) return;
    return createActor(user.users_canister_id, authData);
  }, [user.users_canister_id, authData]);

  const banMutation = useMutation({
    mutationFn: async () => {
      if (!reason) throw new Error("Reason is required for XP ban");
      if (!forHours) throw new Error("Duration is required for XP ban");
      if (!actor) throw new Error("Actor is not defined");

      const forHoursBigInt = BigInt(forHours.toString());

      switch (type) {
        case "xp":
          return callActorMutation(
            actor,
            "ban_user_xp_only",
            user.principal_id,
            reason,
            forHoursBigInt
          );
        case "temporary":
          return callActorMutation(
            actor,
            "suspend_user_temporarily",
            user.principal_id,
            reason,
            forHoursBigInt
          );
        case "permanent":
          return callActorMutation(
            actor,
            "ban_user_permanently",
            user.principal_id,
            reason
          );
      }
    },
    onSuccess: () => {
      Queries.userFromUserId.invalidate(user.principal_id);
      onClose();
    },
  });

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Ban user ${user.user_name}`}
    >

      <ErrorComponent error={banMutation.error} />

      <TabsInputComponent
        label="Ban type"
        value={type}
        tabs={[
          { value: "xp", label: "XP Ban" },
          { value: "temporary", label: "Temporary Suspension" },
          { value: "permanent", label: "Permanent Ban" },
        ]}
        onChange={v => setType(v as "xp" | "temporary" | "permanent")}
      />

      <TextInputComponent
        label="Reason"
        value={reason}
        onChange={setReason}
        placeholder="Enter the reason for the ban"
      />

      {type !== 'permanent' && (
        <NumberInputComponent
          label="Duration (in hours)"
          value={forHours}
          onChangeBigFloat={setForHours}
          min={1}
          max={10000}
        />
      )}
      <ModalFooterPortal>
        <ButtonComponent onClick={close} variant="naked">
          Cancel
        </ButtonComponent>
        <ButtonComponent
          purpose="error"
          isLoading={banMutation.isPending}
          onClick={banMutation.mutateAsync}
        >
          Ban User
        </ButtonComponent>
      </ModalFooterPortal>

    </Modal>
  );
});
BanUserModalComponent.displayName = "BanUserModalComponent";
