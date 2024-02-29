import { createRootRoute } from '@tanstack/react-router';
import '../assets/styles/_vizion.style.scss';
import { Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <Outlet />,
});
