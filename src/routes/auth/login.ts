import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '../../pages/Auth/Login/Login';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});
