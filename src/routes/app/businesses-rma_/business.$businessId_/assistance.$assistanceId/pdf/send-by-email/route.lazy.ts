import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewPdfModalViewSendByEmailModalView from '../../../../../../../views/App/views/Assistance/views/PdfModal/views/SendByEmailModal/SendByEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/pdf/send-by-email')({
  component: AppViewAssistanceViewPdfModalViewSendByEmailModalView,
});
