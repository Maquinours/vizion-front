import { createLazyFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '../../pages/Auth/ResetPassword/ResetPassword';

export const Route = createLazyFileRoute('/auth/reset-password/$token')({
  component: ResetPasswordPage,
});
