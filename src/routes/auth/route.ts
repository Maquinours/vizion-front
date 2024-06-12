import { createFileRoute, redirect } from '@tanstack/react-router';
import { getToken } from '../../utils/functions/token';
import * as Sentry from '@sentry/react';

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    if (getToken())
      throw redirect({
        to: '/app',
        search: { mobileSidebar: undefined },
        replace: true,
      });
    else Sentry.setUser(null);
  },
});
