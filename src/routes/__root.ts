import { createRootRouteWithContext } from '@tanstack/react-router';
import '../assets/styles/_vizion.style.scss';
import { QueryClient } from '@tanstack/react-query';
import RootView from '../views/Root';
import NotFoundComponent from '../components/NotFound/NotFound';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootView,
  notFoundComponent: NotFoundComponent,
});
