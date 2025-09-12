import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { AdminUsersLayout } from './users/users.layout';
import { AdminUserContextLayout } from './users/user-context.layout';


const Layout = lazy(() => import("./layout"));

const DashboardPage = lazy(() => import("./dashboard/dashboard.page"));
const AdminUserPage = lazy(() => import("./users/user.page"));

export const AdminRouter: RouteObject = {
  path: "admin",
  element: <Layout />,
  children: [
    { path: "", element: <DashboardPage /> },
    {
      path: "users",
      element: <AdminUsersLayout />,
      children: [
        { path: "", },
        {
          path: ":userId",
          element: <AdminUserContextLayout />,
          children: [
            { path: "", element: <AdminUserPage /> },
          ]
        },
      ]
    },
  ]
};
