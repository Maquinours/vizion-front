import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewCreateModalView from '../../../../views/App/views/Enterprises/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/enterprises/create')({
  component: AppViewEnterprisesViewCreateModalView,
});
