import { memo } from "react";

export const Layout = memo(() => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Clan Layout</h1>
      <p>This is where you can find all the information about your clan.</p>
      {/* Additional content can be added here */}
    </div>
  );
});
Layout.displayName = "ClanLayout";

export default Layout;
