import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewGedModalViewDeleteModalView from '../../../../../views/App/views/Faq/views/GedModal/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/faq/ged/$faqId/delete/$itemRelativePath')({
  component: AppViewFaqViewGedModalViewDeleteModalView,
});
