import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";
import App from "./App";
import ErrorElement from "@/components/error-element";
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
const TrickcalBoard = lazy(() => import("./trickcalboard"));
const EquipRank = lazy(() => import("./equiprank"));
const Lab = lazy(() => import("./lab"));
const PurpleBoard = lazy(() => import("./purpleboard"));
const BoardSearch = lazy(() => import("./boardsearch"));
const TaskSearch = lazy(() => import("./tasksearch"));
const EventCalc = lazy(() => import("./eventcalc"));
const Checker = lazy(() => import("./checker"));

// import Privacy from "./privacy";
const Privacy = lazy(() => import("./privacy"));
import Setting from "./setting";
import Code from "./code";
import Error404 from "./components/errors/404";

const routes: (IndexRouteObject | NonIndexRouteObject)[] = [
  {
    path: "/",
    element: <App />,
    index: true,
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
  },
  {
    path: "/setting",
    element: (
      <Layout>
        <Setting />
      </Layout>
    ),
    errorElement: <ErrorElement />,
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
    errorElement: <ErrorElement />,
  },
  {
    path: "/code",
    element: <Code />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/*",
    element: <Error404 />,
  },
];

const router = createBrowserRouter(routes);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
