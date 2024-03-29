import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewArchiveModalView from '../../../../views/App/views/Faq/views/ArchiveModal/ArchiveModal';

export const Route = createLazyFileRoute('/app/faq/archive/$faqId')({
  component: AppViewFaqViewArchiveModalView,
});
