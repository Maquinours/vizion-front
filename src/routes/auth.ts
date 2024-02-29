import { createFileRoute } from '@tanstack/react-router';
import AuthLayout from '../layouts/Auth/Auth';

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
});
