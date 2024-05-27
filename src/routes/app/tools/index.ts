import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/tools/')({
  beforeLoad: () => {
    throw redirect({ from: Route.id, to: 'menu', replace: true });
  },
});
