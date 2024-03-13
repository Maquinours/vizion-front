import { createLazyFileRoute } from '@tanstack/react-router';
import AppLayout from '../../views/App/App';

export const Route = createLazyFileRoute('/app')({
  component: AppLayout,
});
