import { createRootRouteWithContext } from '@tanstack/react-router';
import '../assets/styles/_vizion.style.scss';
import { QueryClient } from '@tanstack/react-query';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()();
