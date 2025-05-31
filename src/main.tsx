import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import { AuthProvider } from "@/contexts/AuthContext.tsx";
import ClientProvider from "@/HOC/ClientProvider.tsx";
import CompleteInterest from "./pages/CompleteInterest.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClientProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* <App /> */}
          <CompleteInterest />
        </BrowserRouter>
      </AuthProvider>
    </ClientProvider>
  </StrictMode>
);
