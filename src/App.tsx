import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';

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
      <Route path="/discover" element={<div>Discover Page (Coming Soon)</div>} />
    </Routes>
  );
}

export default App;