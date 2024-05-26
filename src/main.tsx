import React from "react";
import ReactDOM from "react-dom/client";
import AuthContext from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Routes from "./routes";
import "./index.css";
import "./font.css";
import "@/locale/localize";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContext>
      <Routes />
      <Toaster />
    </AuthContext>
  </React.StrictMode>
);
