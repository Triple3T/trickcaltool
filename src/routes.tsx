import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Loading from "@/components/common/loading";
// import TrickcalBoard from "./trickcalboard";
// import PurpleBoard from "./purpleboard";
// import EquipRank from "./equiprank";
// import Lab from "./lab";
// import BoardSearch from "./boardsearch";
// import TaskSearch from "./tasksearch";
// import EventCalc from "./eventcalc";
// import Checker from "./checker";
// import Setting from "./setting";
const TrickcalBoard = lazy(() => import("./trickcalboard"));
const EquipRank = lazy(() => import("./equiprank"));
const Lab = lazy(() => import("./lab"));
const PurpleBoard = lazy(() => import("./purpleboard"));
const BoardSearch = lazy(() => import("./boardsearch"));
const TaskSearch = lazy(() => import("./tasksearch"));
const EventCalc = lazy(() => import("./eventcalc"));
const Checker = lazy(() => import("./checker"));
const Setting = lazy(() => import("./setting"));

import Privacy from "./privacy";
import Code from "./code";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/board",
    // element: <TrickcalBoard />,
    element: (
      <Suspense fallback={<Loading />}>
        <TrickcalBoard />
      </Suspense>
    ),
  },
  {
    path: "/eqrank",
    // element: <EquipRank />,
    element: (
      <Suspense fallback={<Loading />}>
        <EquipRank />
      </Suspense>
    ),
  },
  {
    path: "/lab",
    // element: <Lab />,
    element: (
      <Suspense fallback={<Loading />}>
        <Lab />
      </Suspense>
    ),
  },
  {
    path: "/pboard",
    // element: <PurpleBoard />,
    element: (
      <Suspense fallback={<Loading />}>
        <PurpleBoard />
      </Suspense>
    ),
  },
  {
    path: "/boardsearch",
    // element: <BoardSearch />,
    element: (
      <Suspense fallback={<Loading />}>
        <BoardSearch />
      </Suspense>
    ),
  },
  {
    path: "/tasksearch",
    // element: <TaskSearch />,
    element: (
      <Suspense fallback={<Loading />}>
        <TaskSearch />
      </Suspense>
    ),
  },
  {
    path: "/eventcalc",
    // element: <EventCalc />,
    element: (
      <Suspense fallback={<Loading />}>
        <EventCalc />
      </Suspense>
    ),
  },
  {
    path: "/check",
    // element: <Checker />,
    element: (
      <Suspense fallback={<Loading />}>
        <Checker />
      </Suspense>
    ),
  },
  {
    path: "/setting",
    // element: <Setting />,
    element: (
      <Suspense fallback={<Loading />}>
        <Setting />
      </Suspense>
    ),
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/code",
    element: <Code />,
  },
];

const router = createBrowserRouter(routes);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
