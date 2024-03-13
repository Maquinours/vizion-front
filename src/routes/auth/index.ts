import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/')({
  beforeLoad: () => {
    throw redirect({ from: Route.id, to: './login', replace: true });
  },
});
