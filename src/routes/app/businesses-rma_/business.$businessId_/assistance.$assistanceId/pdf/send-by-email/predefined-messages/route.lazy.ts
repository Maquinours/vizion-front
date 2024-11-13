import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../../views/App/views/Assistance/views/PdfModal/views/SendByEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/pdf/send-by-email/predefined-messages')({
  component: AppViewAssistanceViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView,
});
