import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, AnyRouteMatch } from '@tanstack/react-router';
import { ReactNode } from 'react';
import Loader from './components/Loader/Loader';
import { routeTree } from './routeTree.gen';
import AllBusinessQInfoRequestDto from './utils/types/AllBusinessQInfoRequestDto';

export const queryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    title?: string;
    getTitle?: (queryClient: QueryClient, match: AnyRouteMatch) => Promise<string>;
    getCloseTabRoute?: (prev: { to: string; params: { [key: string]: unknown }; search: { [key: string]: unknown } }) => {
      to: string;
      params: { [key: string]: unknown };
      search: { [key: string]: unknown };
    };
  }
  interface HistoryState {
    qInfos?: Array<AllBusinessQInfoRequestDto>; // used to handle all business search by products
  }
}

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingComponent: Loader,
  Wrap: ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
});
