import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewReceptionViewPdfModalViewSendByEmailModalView from '../../../../../../../views/App/views/Rma/views/Reception/views/PdfModal/views/SendByEmailModal/SendByEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/reception/pdf/send-by-email')({
  component: AppViewRmaViewReceptionViewPdfModalViewSendByEmailModalView,
});
