import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CalendarPage from './pages/CalendarPage';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage';
import SocialMediaPage from './pages/SocialMediaPage';
import EstimatesPage from './pages/EstimatesPage';
import SavedEstimatesPage from './pages/SavedEstimatesPage';
import FollowUpsPage from './pages/FollowUpsPage';
import Layout from './components/layout/Layout';
import ProfileSetup from './components/auth/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function ProtectedLayout() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: ProtectedLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CustomersPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers/$customerId',
  component: CustomerDetailPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: JobsPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const socialMediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/social-media',
  component: SocialMediaPage,
});

const estimatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/estimates',
  component: EstimatesPage,
});

const savedEstimatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/saved-estimates',
  component: SavedEstimatesPage,
});

const followUpsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/follow-ups',
  component: FollowUpsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  customersRoute,
  customerDetailRoute,
  calendarRoute,
  jobsRoute,
  dashboardRoute,
  socialMediaRoute,
  estimatesRoute,
  savedEstimatesRoute,
  followUpsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <ProfileSetup />
      <Toaster />
    </ThemeProvider>
  );
}
