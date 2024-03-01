import { createFileRoute, redirect } from '@tanstack/react-router';
import AuthLayout from '../views/Auth/Auth';
import { getToken } from '../utils/functions/token';

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    if (getToken())
      throw redirect({
        to: '/app',
        search: { showMobileMenu: false },
      });
  },
  component: AuthLayout,
});
