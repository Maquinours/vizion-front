import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import Loader from './components/Loader/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

interface WrapProps {
  children: ReactNode;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingComponent: Loader,
  defaultPreload: 'intent',
  Wrap: ({ children }: WrapProps) => (
    <>
      <ToastContainer position={'bottom-right'} hideProgressBar={true} theme={'colored'} autoClose={3000} />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  ),
});
