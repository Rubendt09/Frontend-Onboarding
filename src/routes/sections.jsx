import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const CourseListPage = lazy(() => import('src/pages/course-list'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const NotificationPage = lazy(() => import('src/pages/notification') ); 
export const EventPage = lazy(() => import('src/pages/event'));
export const RegisterPage = lazy(() => import('src/pages/register')); 
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'app',element: <IndexPage />, index: true },
        { path: 'courselist', element: <CourseListPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'notification', element: <NotificationPage /> },
        { path: 'register', element:<RegisterPage/>},
        { path: 'event', element: <EventPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
