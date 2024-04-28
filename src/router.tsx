import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/Loader/Loader';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    title?: string;
  }
}

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingComponent: Loader,
  defaultPreload: 'intent',
  Wrap: ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
});
