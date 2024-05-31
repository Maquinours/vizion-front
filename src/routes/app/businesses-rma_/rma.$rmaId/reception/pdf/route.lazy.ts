import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewReceptionViewPdfModalView from '../../../../../../views/App/views/Rma/views/Reception/views/PdfModal/PdfModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/reception/pdf')({
  component: AppViewRmaViewReceptionViewPdfModalView,
});
