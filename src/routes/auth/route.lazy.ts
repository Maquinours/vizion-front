import { createLazyFileRoute } from '@tanstack/react-router';
import AuthLayout from '../../views/Auth/Auth';

export const Route = createLazyFileRoute('/auth')({
  component: AuthLayout,
});
