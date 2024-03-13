import { createLazyFileRoute } from '@tanstack/react-router';
import LoginPage from '../../../views/Auth/views/Login/Login';

export const Route = createLazyFileRoute('/auth/login')({
  component: LoginPage,
});
