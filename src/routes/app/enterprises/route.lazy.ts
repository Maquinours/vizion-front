import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesView from '../../../views/App/views/Enterprises/Enterprises';

export const Route = createLazyFileRoute('/app/enterprises')({
  component: AppViewEnterprisesView,
});
