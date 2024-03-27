import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/products/$productId/')({
  beforeLoad: () => {
    throw redirect({ from: Route.id, to: './informations', search: (old) => ({ ...old, lifesheetPage: 0 }), params: (old) => old });
  },
});
