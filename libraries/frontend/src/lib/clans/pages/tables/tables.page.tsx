import { memo } from "react";

export const ClanTablesPage = memo(() => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Clan Tables</h1>
      <p>This is where you can find all the tables for your clan.</p>
      {/* Additional content can be added here */}
    </div>
  );
});
ClanTablesPage.displayName = "ClanTablesPage";

export default ClanTablesPage;
