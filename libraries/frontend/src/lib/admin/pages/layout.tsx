import { memo } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "../../user";
import { LayoutComponent, UnwrapOptional } from "@zk-game-dao/ui";
import { SidebarComponent } from "@/src/components/common/sidebar/sidebar.component";
import { Cog6ToothIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

export const Layout = memo(() => {

  const { user } = useUser();

  if (!UnwrapOptional(user?.admin_role))
    return (
      <p className="text-center text-red-500 container">
        You do not have permission to access this page.
      </p>
    );

  return (
    <LayoutComponent footer>
      <div className='flex flex-row gap-4 md:gap-16 container w-full mx-auto'>
        <SidebarComponent
          items={[
            {
              type: 'link',
              title: 'Home',
              value: `/admin/`,
              icon: <HomeIcon />,
            },
            {
              type: 'link',
              icon: <UserIcon />,
              title: 'Users',
              hasSubroutes: true,
              value: `/admin/users`,
            },
          ]}
        />
        <div className='flex flex-col w-full'>
          <Outlet />
        </div>
      </div >
    </LayoutComponent>
  );
});
Layout.displayName = "AdminLayout";

export default Layout;
