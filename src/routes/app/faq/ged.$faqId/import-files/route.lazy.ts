import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewGedModalViewImportFilesModalView from '../../../../../views/App/views/Faq/views/GedModal/views/ImportFilesModal/ImportFilesModal';

export const Route = createLazyFileRoute('/app/faq/ged/$faqId/import-files')({
  component: AppViewFaqViewGedModalViewImportFilesModalView,
});
