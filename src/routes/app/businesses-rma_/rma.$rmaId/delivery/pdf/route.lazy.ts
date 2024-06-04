import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewDeliveryViewPdfModalView from '../../../../../../views/App/views/Rma/views/Delivery/views/PdfModal/PdfModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/delivery/pdf')({
  component: AppViewRmaViewDeliveryViewPdfModalView,
});
