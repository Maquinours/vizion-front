import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewGedModalView from '../../../../views/App/views/Faq/views/GedModal/GedModal';

export const Route = createLazyFileRoute('/app/faq/ged/$faqId')({
  component: AppViewFaqViewGedModalView,
});
