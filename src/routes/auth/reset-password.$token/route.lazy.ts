import { createLazyFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '../../../views/Auth/views/ResetPassword/ResetPassword';

export const Route = createLazyFileRoute('/auth/reset-password/$token')({
  component: ResetPasswordPage,
});
