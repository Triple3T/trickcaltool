import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import "./index.css";
import "./font.css";
import TrickcalBoard from "./trickcalboard";
import EquipRank from "./equiprank";
import Lab from "./lab";
import TaskSearch from "./tasksearch";

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
    path: "/tasksearch",
    element: <TaskSearch />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
