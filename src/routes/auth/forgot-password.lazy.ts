import { createLazyFileRoute } from '@tanstack/react-router';
import ForgotPasswordPage from '../../pages/Auth/ForgotPassword/ForgotPassword';

export const Route = createLazyFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
});
