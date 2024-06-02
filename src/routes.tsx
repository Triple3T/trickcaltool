import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Layout from "@/components/layout";
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

// import Privacy from "./privacy";
const Privacy = lazy(() => import("./privacy"));
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
      <Layout>
        <Suspense fallback={<Loading />}>
          <TrickcalBoard />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/eqrank",
    // element: <EquipRank />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <EquipRank />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/lab",
    // element: <Lab />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Lab />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/pboard",
    // element: <PurpleBoard />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <PurpleBoard />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/boardsearch",
    // element: <BoardSearch />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <BoardSearch />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/tasksearch",
    // element: <TaskSearch />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <TaskSearch />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/eventcalc",
    // element: <EventCalc />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <EventCalc />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/check",
    // element: <Checker />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Checker />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/setting",
    // element: <Setting />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Setting />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/privacy",
    // element: <Privacy />,
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Privacy />
        </Suspense>
      </Layout>
    ),
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
