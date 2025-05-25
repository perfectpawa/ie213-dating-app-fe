import { Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import UserProfile from '../pages/UserProfile';
import Matching from '../pages/Matching';
import Setting from '../pages/Setting';
import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import CompleteProfile from '../pages/CompleteProfile';
import EmailVerification from '../pages/EmailVerification';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

export const routeComponents = {
  root: <Navigate to="/home" replace />,
  signin: (
    <PublicRoute>
      <SignIn />
    </PublicRoute>
  ),
  signup: (
    <PublicRoute>
      <SignUp />
    </PublicRoute>
  ),
  forgotPassword: (
    <PublicRoute>
      <ForgotPassword />
    </PublicRoute>
  ),
  emailVerification: (
    <PublicRoute>
      <EmailVerification />
    </PublicRoute>
  ),
  completeProfile: (
    <ProtectedRoute>
      <CompleteProfile />
    </ProtectedRoute>
  ),
  home: (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  ),
  profile: (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
  userProfile: (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  ),
  messages: (
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  ),
  discover: (
    <ProtectedRoute>
      <Matching />
    </ProtectedRoute>
  ),
  setting: (
    <ProtectedRoute>
      <Setting />
    </ProtectedRoute>
  ),
  notFound: <Navigate to="/home" replace />,
}; 