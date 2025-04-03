import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MatchingOpponentsList from "./components/MatchingOpponentsList.tsx";
import Matching from "./pages/Matching.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Matching />
  </StrictMode>
);
