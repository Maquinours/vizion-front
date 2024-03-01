import { createFileRoute, redirect } from '@tanstack/react-router';
import { getToken } from '../utils/functions/token';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (getToken()) throw redirect({ to: '/app', search: { showMobileMenu: false } });
    throw redirect({ to: '/auth/login' });
  },
});
