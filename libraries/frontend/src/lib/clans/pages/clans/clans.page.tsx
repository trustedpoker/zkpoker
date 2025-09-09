import { ButtonComponent } from "@zk-game-dao/ui";
import { memo, useState } from "react";
import { CreateClanModalComponent } from "./create-clan-modal/create-clan-modal.component";

export const ClansPage = memo(() => {

  const [showCreateClanModal, setShowCreateClanModal] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Clans Page</h1>
      <p>This is where you can find all the information about your clans.</p>
      {/* Additional content can be added here */}

      <ButtonComponent
        className="mt-4"
        onClick={() => setShowCreateClanModal(true)}
      >
        Create Clan
      </ButtonComponent>

      <CreateClanModalComponent
        open={showCreateClanModal}
        onCancel={() => setShowCreateClanModal(false)}
      />

    </div>
  );
});
ClansPage.displayName = "ClansPage";

export default ClansPage;