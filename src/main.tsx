import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthContext from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import "./index.css";
import "./font.css";
import TrickcalBoard from "./trickcalboard";
import PurpleBoard from "./purpleboard";
import EquipRank from "./equiprank";
import Lab from "./lab";
import TaskSearch from "./tasksearch";
import EventCalc from "./eventcalc";

import Code from "./code";
import Setting from "./setting";
import Privacy from "./privacy";

import "@/locale/localize";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/board",
    element: <TrickcalBoard />,
  },
  {
    path: "/eqrank",
    element: <EquipRank />,
  },
  {
    path: "/lab",
    element: <Lab />,
  },
  {
    path: "/pboard",
    element: <PurpleBoard />,
  },
  {
    path: "/tasksearch",
    element: <TaskSearch />,
  },
  {
    path: "/eventcalc",
    element: <EventCalc />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/setting",
    element: <Setting />,
  },
  {
    path: "/code",
    element: <Code />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContext>
      <RouterProvider router={router} />
      <Toaster />
    </AuthContext>
  </React.StrictMode>
);
