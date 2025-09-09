import { Queries } from '@/src/lib/data';
import { useUserFromUserId } from '@/src/lib/user/hooks/use-user';
import { createActor } from '@declarations/users_canister';
import { AdminRole, User } from '@declarations/users_canister/users_canister.did';
import { Principal } from '@dfinity/principal';
import { UseMutationResult } from '@tanstack/react-query';
import { useAuth } from '@zk-game-dao/currency';
import { callActorMutation, ErrorComponent, LoadingAnimationComponent, LoadingSpinnerComponent, useMutation } from '@zk-game-dao/ui';
import classNames from 'classnames';
import { createContext, memo, useContext, useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';

type AdminUserContextType = {
  user: User;
  actor: ReturnType<typeof createActor>;
  setRole(role?: AdminRole): Promise<User | void>;
  unBanMutation: UseMutationResult<User | undefined, Error, void, unknown>;
};

const AdminUserContext = createContext<AdminUserContextType | null>(null);

export const useAdminUser = (): AdminUserContextType => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error("useAdminUser must be used within an AdminUserProvider");
  }
  return context;
}

export const AdminUserContextLayout = memo(() => {

  const { userId } = useParams<{ userId: string }>();

  const user = useUserFromUserId(userId ? Principal.fromText(userId) : undefined);
  const { authData } = useAuth();

  const actor = useMemo(() => {
    if (!user.data?.users_canister_id) return undefined;
    return createActor(user.data.users_canister_id, authData);
  }, [user.data?.users_canister_id, authData]);

  const setRoleMutation = useMutation({
    mutationFn: async (role?: AdminRole) => {
      if (!user.data || !actor) return;

      if (!role) {
        return callActorMutation(
          actor,
          "remove_admin_role",
          user.data.principal_id
        );
      }

      return callActorMutation(
        actor,
        "promote_user_to_admin",
        user.data.principal_id,
        role
      )
    },
    onSuccess: (user) => Queries.userFromUserId.invalidate(user?.principal_id),
  });

  const unBanMutation = useMutation({
    mutationFn: async () => {
      if (!user.data || !actor) return;
      return callActorMutation(
        actor,
        "unban_user",
        user.data.principal_id
      );
    },
    onSuccess: (user) => Queries.userFromUserId.invalidate(user?.principal_id),
  });

  const isLoading = useMemo(() => user.isPending || setRoleMutation.isPending, [user.isPending, setRoleMutation.isPending]);

  if (user.isPending)
    return <LoadingAnimationComponent>Loading user "{userId}"...</LoadingAnimationComponent>;

  if (!user.data || !actor) return <p>User with id "{userId}" not found</p>

  return (
    <div
      className={classNames('flex flex-col gap-4 relative', {
        'opacity-50': isLoading,
      })}
    >
      {isLoading && (
        <LoadingSpinnerComponent className='absolute inset-0 z-10' />
      )}
      <AdminUserContext.Provider
        value={{
          actor,
          user: user.data,
          setRole: setRoleMutation.mutateAsync,
          unBanMutation
        }}
      >
        <Outlet />
      </AdminUserContext.Provider>
      <ErrorComponent title="Setting role" error={setRoleMutation.error} />
      <ErrorComponent title="Unbanning user" error={unBanMutation.error} />
    </div>
  );
});
AdminUserContextLayout.displayName = "AdminUserContextLayout";
