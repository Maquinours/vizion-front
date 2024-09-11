import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewPdfModalView from '../../../../../../views/App/views/Assistance/views/PdfModal/PdfModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf')({
  component: AppViewAssistanceViewPdfModalView,
});
