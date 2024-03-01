import { createLazyFileRoute } from '@tanstack/react-router';
import ForgotPasswordPage from '../../views/Auth/views/ForgotPassword/ForgotPassword';

export const Route = createLazyFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
});
