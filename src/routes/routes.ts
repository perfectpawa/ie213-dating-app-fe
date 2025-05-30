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
    path: '/profile/:userId',
    element: routeComponents.userProfile,
  },  {
    path: '/messages',
    element: routeComponents.messages,
  },
  {
    path: '/messages/:matchId',
    element: routeComponents.messages,
  },
  {
    path: '/discover',
    element: routeComponents.discover,
  },{
    path: '/matching',
    element: routeComponents.matching,
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