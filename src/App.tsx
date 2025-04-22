import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matching from "@/pages/Matching.tsx";
import Setting from "@/pages/Setting.tsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={
        <Profile
          username="Ada Wong"
          bio="Play with boys and kill zombies"
          interests={["Punching", "Killing", "Eating", "Sleeping", "Movies"]}
          location="Raccoon City"
          age={27}
        />
        } />
        <Route path="/messages" element={<div>Messages Page (Coming Soon)</div>} />
        <Route path="/discover" element={<Matching/>} />
        <Route path="/setting" element={<Setting/>} />
    </Routes>
  );
}

export default App;