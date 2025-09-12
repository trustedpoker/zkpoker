import { users_index } from '@declarations/users_index';
import { Principal } from '@dfinity/principal';
import { callActorMutation, TextInputComponent, useMutation } from '@zk-game-dao/ui';
import { memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AdminUsersLayout = memo(() => {

  const navigate = useNavigate();

  const searchMut = useMutation({
    mutationKey: ["searchUser"],
    mutationFn: async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < 3) return;
      try {
        return Principal.fromText(searchTerm)
      } catch {
        return callActorMutation(users_index, "get_user_by_username", searchTerm).then(([user_id]) => user_id);
      }
    },
    throwOnError: false,
    onSuccess: (userId) => userId && navigate(`/admin/users/${userId}`),
  });

  return (
    <section className='flex flex-col gap-4'>
      <TextInputComponent
        label="Search user"
        value={searchMut.variables}
        placeholder="Search by name or principal"
        onChange={(v) => searchMut.mutate(v)}
      />

      <Outlet />
    </section>
  );
});
AdminUsersLayout.displayName = "AdminUsersLayout";
