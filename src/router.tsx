import { createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import Loader from './components/Loader/Loader';

export const router = createRouter({
  routeTree,
  defaultPendingComponent: Loader,
});
