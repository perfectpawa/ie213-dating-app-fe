import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matching from "./pages/Matching";
import Setting from "./pages/Setting";
import Chat from "./pages/Chat";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public routes that don't require authentication
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile
            username="Ada Wong"
            bio="Play with boys and kill zombies"
            interests={["Punching", "Killing", "Eating", "Sleeping", "Movies"]}
            location="Raccoon City"
            age={27}
          />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/discover" element={
        <ProtectedRoute>
          <Matching />
        </ProtectedRoute>
      } />
      <Route path="/setting" element={
        <ProtectedRoute>
          <Setting />
        </ProtectedRoute>
      } />

      {/* Redirect root to home if authenticated, otherwise to signin */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;