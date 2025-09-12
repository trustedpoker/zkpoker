import { useFormatDateDistance } from '@/src/hooks/countdown';
import { BanType } from '@declarations/users_canister/users_canister.did';
import { Principal } from '@dfinity/principal';
import { BigIntTimestampToDate, List, ListItem, matchRustEnum } from '@zk-game-dao/ui';
import { memo } from 'react';

import { useUserFromUserId } from '../../user/hooks/use-user';

type BanTypeDestruct = {
  banned_at: bigint;
  banned_by: Principal;
  expires_at?: bigint;
  reason: string;
}

export const BanTypeComponent = memo<{ type: BanType; className?: string; }>(({ type, className }) => {

  const {
    banned_at,
    banned_by,
    expires_at,
    reason,
  } = matchRustEnum(type)({
    XpBan: (t): BanTypeDestruct => ({ ...t }),
    TemporarySuspension: (t): BanTypeDestruct => ({ ...t }),
    PermanentBan: (t): BanTypeDestruct => ({ ...t }),
  });

  const bannedAt = useFormatDateDistance(BigIntTimestampToDate(banned_at));
  const expiresAt = useFormatDateDistance(!expires_at ? undefined : BigIntTimestampToDate(expires_at));

  const bannedByUser = useUserFromUserId(banned_by);

  return (
    <List
      className={className}
      label={matchRustEnum(type)({
        XpBan: () => "XP Ban",
        TemporarySuspension: () => "Temporary Suspension",
        PermanentBan: () => "Permanent Ban",
      })}
    >
      {bannedAt && <ListItem rightLabel={bannedAt.string}>Time</ListItem>}
      <ListItem rightLabel={!bannedByUser.data ? `${banned_by.toText().slice(0, 10)}...` : bannedByUser.data.user_name}>Banned by</ListItem>
      {expiresAt && <ListItem rightLabel={expiresAt.string}>Expiry</ListItem>}
      <ListItem rightLabel={reason || "No reason provided"}>Reason</ListItem>
    </List>
  )
});
BanTypeComponent.displayName = "BanTypeComponent";
