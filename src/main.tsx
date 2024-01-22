import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./font.css";
import TrickcalBoard from "./trickcalboard";

import '@/locale/localize';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/board",
    element: <TrickcalBoard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
