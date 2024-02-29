import { createRootRoute, Outlet } from '@tanstack/react-router';
import '../assets/styles/_vizion.style.scss';

export const Route = createRootRoute({
  component: () => <Outlet />,
});
