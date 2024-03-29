import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqView from '../../../views/App/views/Faq/Faq';

export const Route = createLazyFileRoute('/app/faq')({
  component: AppViewFaqView,
});
