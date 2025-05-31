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
import GoogleCallback from '../pages/GoogleCallback';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import CompleteInterest from '@/pages/CompleteInterest';

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
  completeInterest: (
    <ProtectedRoute>
      <CompleteInterest />
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
  matching: (
    <ProtectedRoute>
      <Matching />
    </ProtectedRoute>
  ),
  setting: (
    <ProtectedRoute>
      <Setting />
    </ProtectedRoute>
  ),
  googleCallback: (
    <PublicRoute>
      <GoogleCallback />
    </PublicRoute>
  ),
  notFound: <Navigate to="/home" replace />,
}; 