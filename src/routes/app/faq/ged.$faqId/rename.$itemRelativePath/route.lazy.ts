import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewGedModalViewRenameModalView from '../../../../../views/App/views/Faq/views/GedModal/views/RenameModal/RenameModal';

export const Route = createLazyFileRoute('/app/faq/ged/$faqId/rename/$itemRelativePath')({
  component: AppViewFaqViewGedModalViewRenameModalView,
});
