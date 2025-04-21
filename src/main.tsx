import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LeftSideSetting from "./components/Setting/LeftSideSetting.tsx";
import RightSideSetting from "./components/Setting/RightSideSetting.tsx";
import Setting from "./pages/Setting.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Setting />
  </StrictMode>
);
