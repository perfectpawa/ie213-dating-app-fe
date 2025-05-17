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
import CompleteProfile from './pages/CompleteProfile';

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

  // If user is authenticated, redirect to home or complete profile
  if (user) {
    return <Navigate to={user.completeProfile ? "/home" : "/complete-profile"} replace />;
  }

  return <>{children}</>;
};

// Protected route that checks for completeProfile
const SetupProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.completeProfile) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

// Protected route that requires completeProfile
const CompleteSetupProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!user.completeProfile) {
    return <Navigate to="/complete-profile" replace />;
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

      {/* Profile Completion Route */}
      <Route path="/complete-profile" element={
        <SetupProtectedRoute>
          <CompleteProfile />
        </SetupProtectedRoute>
      } />

      {/* Protected Routes that require completeProfile */}
      <Route path="/home" element={
        <CompleteSetupProtectedRoute>
          <Home />
        </CompleteSetupProtectedRoute>
      } />
      <Route path="/profile" element={
        <CompleteSetupProtectedRoute>
          <Profile
            username="Ada Wong"
            bio="Play with boys and kill zombies"
            interests={["Punching", "Killing", "Eating", "Sleeping", "Movies"]}
            location="Raccoon City"
            age={27}
          />
        </CompleteSetupProtectedRoute>
      } />
      <Route path="/messages" element={
        <CompleteSetupProtectedRoute>
          <Chat />
        </CompleteSetupProtectedRoute>
      } />
      <Route path="/discover" element={
        <CompleteSetupProtectedRoute>
          <Matching />
        </CompleteSetupProtectedRoute>
      } />
      <Route path="/setting" element={
        <CompleteSetupProtectedRoute>
          <Setting />
        </CompleteSetupProtectedRoute>
      } />

      {/* Redirect root to home if authenticated, otherwise to signin */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

// function App() {
//   return (
//     <Routes>
//       <Route path="/complete-profile" element={<CompleteProfile />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/home" element={<Home />} />
//       <Route path="/profile" element={<Profile username="Ada Wong" bio="Play with boys and kill zombies" interests={["Punching", "Killing", "Eating", "Sleeping", "Movies"]} location="Raccoon City" age={27} />} />
//       <Route path="/messages" element={<Chat />} />
//       <Route path="/discover" element={<Matching />} />
//       <Route path="/setting" element={<Setting />} />
//     </Routes>
//   );
// }

export default App;