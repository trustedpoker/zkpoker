import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const ClansPage = lazy(() => import("./clans/clans.page"));

const ClanContextLayout = lazy(() => import("./context-layout"));
const ClanLayout = lazy(() => import("./layout"));

const ClanHomePage = lazy(() => import("./home/home.page"));
const ClanLeaderboardPage = lazy(() => import("./leaderboard/leaderboard.page"));
const ClanTablesPage = lazy(() => import("./tables/tables.page"));

export const ClansRouter: RouteObject = {
  path: "clans",
  children: [
    { path: "", element: <ClansPage /> },
    {
      path: ":clanId",
      element: <ClanContextLayout />,
      children: [
        {
          path: "",
          element: <ClanLayout />,
          children: [
            { path: "", element: <ClanHomePage /> },
            { path: "leaderboard", element: <ClanLeaderboardPage /> },
            { path: "tables", element: <ClanTablesPage /> },
          ]
        },
      ]
    },
  ]
};
