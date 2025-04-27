import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matching from "@/pages/Matching.tsx";
import Setting from "@/pages/Setting.tsx";
import Chat from "@/pages/Chat.tsx";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={
        <Profile
          username="Ada Wong"
          bio="Play with boys and kill zombies"
          interests={["Punching", "Killing", "Eating", "Sleeping", "Movies"]}
          location="Raccoon City"
          age={27}
        />
        } />
        <Route path="/messages" element={<Chat/>} />
        <Route path="/discover" element={<Matching/>} />
        <Route path="/setting" element={<Setting/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;