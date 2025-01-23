import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import AuthContext from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ContextErrorElement from "@/components/errors/context-error-element";
import Routes from "./routes";
import "./index.css";
import "./font.css";
import "@/locale/localize";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ContextErrorElement}>
      <AuthContext>
        <Routes />
        <Toaster />
      </AuthContext>
    </ErrorBoundary>
  </React.StrictMode>
);
