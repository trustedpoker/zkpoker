import { memo, useMemo, useState } from "react";
import { useAdminUser } from "./user-context.layout";
import { ButtonComponent, matchRustEnum, TabsInputComponent, UnwrapOptional } from "@zk-game-dao/ui";
import { BanTypeComponent } from "../../components/ban-type.component";
import { BanUserModalComponent } from "../../components/ban-user-modal.component";
import { useUser } from "@/src/lib/user";

export const AdminUserPage = memo(() => {
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const { user: userSelf } = useUser();
  const { user, setRole, unBanMutation } = useAdminUser();

  const role = useMemo(() => {
    const r = UnwrapOptional(user.admin_role);
    if (!r) return "None";
    return matchRustEnum(r)({
      Moderator: () => "Moderator" as const,
      Admin: () => "Admin" as const,
      SuperAdmin: () => "SuperAdmin" as const,
    });
  }, [user.admin_role]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="type-header ">{user.user_name} {userSelf?.principal_id.compareTo(user.principal_id) === 'eq' && <span className="type-tiny text-green-500">(YOU)</span>}</h1>
        <p className="type-subheadline text-material-heavy-1">Principal <strong>{user.principal_id.toText()}</strong></p>
        <p className="type-subheadline text-material-heavy-1">Users Canister <strong>{user.users_canister_id.toText()}</strong></p>
      </div>

      <p className="type-title mt-8">Admin status</p>

      <TabsInputComponent
        label="Admin role"
        value={role}
        tabs={[
          { value: "None" as const, label: "None" },
          { value: "Moderator" as const, label: "Moderator" },
          { value: "Admin" as const, label: "Admin" },
        ]}
        onChange={(role) => {
          if (role === "None") return setRole();
          if (role === "Moderator") return setRole({ Moderator: null });
          if (role === "Admin") return setRole({ Admin: null });
        }}
      />

      <p className="type-title mt-8">Ban status</p>

      {user.ban_status[0] && <BanTypeComponent type={user.ban_status[0]} />}

      <div className="flex flex-row gap-2">
        <ButtonComponent
          purpose="error"
          onClick={() => setIsBanModalOpen(true)}
        >
          Ban user
        </ButtonComponent>
        {UnwrapOptional(user.ban_status) && (
          <ButtonComponent
            isLoading={unBanMutation.isPending}
            onClick={unBanMutation.mutateAsync}
          >
            Unban user
          </ButtonComponent>
        )}
      </div>

      <BanUserModalComponent
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        user={user}
      />
    </>
  );
});
AdminUserPage.displayName = "AdminUserPage";

export default AdminUserPage;
