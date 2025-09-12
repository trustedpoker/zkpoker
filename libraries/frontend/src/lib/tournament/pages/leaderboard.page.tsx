import { memo, useMemo } from 'react';

import { createActor } from '@declarations/tournament_canister';
import { callActorMutation, TitleTextComponent, UnwrapOptional, useQuery } from '@zk-game-dao/ui';

import {
  TournamentLeaderboardEntryData
} from '../components/tournament-leaderboard/tournament-leaderboard-entry.component';
import {
  TournamentLeaderboardComponent
} from '../components/tournament-leaderboard/tournament-leaderboard.component';
import { useTournament } from '../context/tournament.context';

export const TournamentLeaderboardPage = memo(() => {
  const { data, prizepool, user } = useTournament(true);

  const isCompleted = useMemo(() => 'Completed' in data.state || 'Cancelled' in data.state, [data.state]);
  const hasSortedUsers = useMemo(() => !!data.sorted_users[0]?.length && data.sorted_users[0].length > 0, [data.sorted_users[0]?.length]);
  const remainingPlayers = useMemo(() => data.current_players.length, [data.current_players]);

  const leaderboard = useQuery({
    queryKey: ['leaderboard', remainingPlayers, data.id.toText()],
    queryFn: () => callActorMutation(createActor(data.id), 'get_leaderboard'),
    select: (data): TournamentLeaderboardEntryData[] => data.map(([user_id, rank]) => ({
      user_id,
      rank: Number(rank),
    })).sort((a, b) => a.rank - b.rank),
    refetchInterval: 120000, // 2 minutes
    initialData: [],
    enabled: !hasSortedUsers
  });

  const liveLeaderboard = useQuery({
    queryKey: ['live-leaderboard', remainingPlayers, isCompleted ? 'completed' : 'running', data.id.toText()],
    queryFn: () => callActorMutation(createActor(data.id), "get_live_leaderboard"),
    select: (data): TournamentLeaderboardEntryData[] => data.map(([user_id, chips], rank) => ({
      user_id,
      chips,
      rank
    })),
    enabled: !isCompleted && !hasSortedUsers,
    refetchInterval: 120000, // 2 minutes
    initialData: [],
  });

  return (
    <>
      <TitleTextComponent
        title="Leaderboard"
        text={'Completed' in data.state ? 'The tournaments winners' : 'Current standings'}
        leftAligned
        className='mb-4'
      />
      <TournamentLeaderboardComponent
        leaderboard={leaderboard}
        liveLeaderboard={liveLeaderboard}
        isCompleted={isCompleted}
        payoutStructure={data.payout_structure}
        prizepool={prizepool}
        currencyType={data.currency}
        tournamentUserId={user?.principal}
        sortedUsers={UnwrapOptional(data.sorted_users)}
      />
    </>
  );
});
TournamentLeaderboardPage.displayName = 'TournamentLeaderboardPage';

export default TournamentLeaderboardPage;
