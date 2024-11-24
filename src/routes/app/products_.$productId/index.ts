import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/products_/$productId/')({
  loader: () => {
    throw redirect({
      from: Route.fullPath,
      to: './informations',
      search: (old) => ({ ...old, lifesheetPage: 0 }),
      params: (old) => old,
    });
  },
});
