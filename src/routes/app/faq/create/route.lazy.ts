import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewCreateModalView from '../../../../views/App/views/Faq/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/faq/create')({
  component: AppViewFaqViewCreateModalView,
});
