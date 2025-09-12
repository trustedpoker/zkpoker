import { AdminRole } from "@declarations/table_index/table_index.did";
import { _SERVICE, User } from "@declarations/users_canister/users_canister.did";
import { matchRustEnum, UnwrapOptional } from "@zk-game-dao/ui";
import { createContext, useContext, useMemo } from "react";

export const WalletTypeLocalStorageKey = "zkp:wallet-type-v1";

const UserContext = createContext<{
  user?: User;
  actor?: _SERVICE;
  isLoading: boolean;
  show(): void;
  /** @deprecated use show instead */
  showProfile(): void;
  /** @deprecated use show instead */
  showSignup(): void;
}>({
  isLoading: true,
  show: () => { },
  showProfile: () => { },
  showSignup: () => { },
});

export const {
  Provider: RawUserContextProvider,
  Consumer: UserContextConsumer,
} = UserContext;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const useHasAdminRole = (
  ...roles: AdminRole[]
) => {
  const { user } = useUser();
  return useMemo(() => {
    const adminRole = UnwrapOptional(user?.admin_role);
    if (!adminRole) return roles.length === 0;
    return roles.some(role => matchRustEnum(adminRole)({
      Admin: () => "Admin" in role,
      Moderator: () => "Moderator" in role,
      SuperAdmin: () => "SuperAdmin" in role,
    }))
  }, [user?.admin_role, roles]);
}