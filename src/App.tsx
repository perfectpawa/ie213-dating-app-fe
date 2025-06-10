import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/routes";
import AIAssistant from './pages/AIAssistant';
import "./App.css";

function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="/ai-assistant" element={<AIAssistant />} />
    </Routes>
  );
}

export default App;
