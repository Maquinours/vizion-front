import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '../../views/Auth/views/Login/Login';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});
