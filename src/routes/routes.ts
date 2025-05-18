import { routeComponents } from './routeComponents';

export const routes = [
  {
    path: '/',
    element: routeComponents.root,
  },
  {
    path: '/signin',
    element: routeComponents.signin,
  },
  {
    path: '/signup',
    element: routeComponents.signup,
  },
  {
    path: '/forgot-password',
    element: routeComponents.forgotPassword,
  },
  {
    path: '/verify-email',
    element: routeComponents.emailVerification,
  },
  {
    path: '/complete-profile',
    element: routeComponents.completeProfile,
  },
  {
    path: '/home',
    element: routeComponents.home,
  },
  {
    path: '/profile',
    element: routeComponents.profile,
  },
  {
    path: '/messages',
    element: routeComponents.messages,
  },
  {
    path: '/discover',
    element: routeComponents.discover,
  },
  {
    path: '/setting',
    element: routeComponents.setting,
  },
  {
    path: '*',
    element: routeComponents.notFound,
  },
]; 