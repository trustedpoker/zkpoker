import { memo } from "react";

export const ClanLeaderboardPage = memo(() => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Clan Leaderboard</h1>
      <p>This is where you can find the leaderboard for your clan.</p>
      {/* Additional content can be added here */}
    </div>
  );
});
ClanLeaderboardPage.displayName = "ClanLeaderboardPage";

export default ClanLeaderboardPage;