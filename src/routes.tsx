import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";
import App from "./App";
import ErrorElement from "@/components/error-element";
import Layout from "@/components/layout";
import Loading from "@/components/common/loading";
// import TrickcalBoard from "./trickcalboard";
// import EquipRank from "./equiprank";
// import Lab from "./lab";
// import PurpleBoard from "./purpleboard";
// import BoardSearch from "./boardsearch";
// import TaskSearch from "./tasksearch";
// import Restaurant from "./restaurant";
// import NormalDrop from "./normaldrop";
// import EquipViewer from "./equipviewer";
// import Personal from "./personal";
// import EventCalc from "./eventcalc";
// import GoodsCalc from "./goodscalc";
// import Checker from "./checker";
const TrickcalBoard = lazy(() => import("./trickcalboard"));
const EquipRank = lazy(() => import("./equiprank"));
const Lab = lazy(() => import("./lab"));
const PurpleBoard = lazy(() => import("./purpleboard"));
const BoardSearch = lazy(() => import("./boardsearch"));
const TaskSearch = lazy(() => import("./tasksearch"));
const Restaurant = lazy(() => import("./restaurant"));
const NormalDrop = lazy(() => import("./normaldrop"));
const EquipViewer = lazy(() => import("./equipviewer"));
const Personal = lazy(() => import("./personal"));
const EventCalc = lazy(() => import("./eventcalc"));
const GoodsCalc = lazy(() => import("./goodscalc"));
const Checker = lazy(() => import("./checker"));

// import Privacy from "./privacy";
const Privacy = lazy(() => import("./privacy"));
import Setting from "./setting";
import Code from "./code";
import Clear from "./clear";
// import DealDesc from "./dealdesc";
const DealDesc = lazy(() => import("./dealdesc"));
// import PickupLog from "./pickups";
const PickupLog = lazy(() => import("./pickups"));
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
      <Layout title="ui.board.title">
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
      <Layout title="ui.equiprank.title">
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
      <Layout title="ui.lab.title">
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
      <Layout title="ui.board.pboardTitle">
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
      <Layout title="ui.boardsearch.title">
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
      <Layout title="ui.tasksearch.title">
        <Suspense fallback={<Loading />}>
          <TaskSearch />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/restaurant",
    // element: <Restaurant />,
    element: (
      <Layout title="ui.restaurant.title">
        <Suspense fallback={<Loading />}>
          <Restaurant />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/normaldrop",
    // element: <NormalDrop />,
    element: (
      <Layout title="ui.normaldrop.title">
        <Suspense fallback={<Loading />}>
          <NormalDrop />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/equipviewer",
    // element: <EquipViewer />,
    element: (
      <Layout title="ui.equipviewer.title">
        <Suspense fallback={<Loading />}>
          <EquipViewer />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/personal",
    // element: <Personal />,
    element: (
      <Layout title="ui.personal.title">
        <Suspense fallback={<Loading />}>
          <Personal />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/eventcalc",
    // element: <EventCalc />,
    element: (
      <Layout title="ui.eventcalc.title">
        <Suspense fallback={<Loading />}>
          <EventCalc />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/goodscalc",
    // element: <GoodsCalc />,
    element: (
      <Layout title="ui.goodscalc.title">
        <Suspense fallback={<Loading />}>
          <GoodsCalc />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/check",
    // element: <Checker />,
    element: (
      <Layout title="ui.check.title">
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
      <Layout title="ui.index.setting">
        <Setting />
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/privacy",
    // element: <Privacy />,
    element: (
      <Layout title="ui.index.privacyPolicy">
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
    path: "/clear",
    element: <Clear />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/dealdesc",
    element: (
      <Layout title="ui.dealdesc.title">
        <Suspense fallback={<Loading />}>
          <DealDesc />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/pickups",
    element: (
      <Layout title="ui.pickuplog.title">
        <Suspense fallback={<Loading />}>
          <PickupLog />
        </Suspense>
      </Layout>
    ),
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
