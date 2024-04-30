import React from "react";
import ReactDOM from "react-dom/client";
import AuthContext from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Route from "./route";
import "./index.css";
import "./font.css";
import "@/locale/localize";

if (typeof window !== "undefined") import("./utils/pwa");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContext>
      <Route />
      <Toaster />
    </AuthContext>
  </React.StrictMode>
);
