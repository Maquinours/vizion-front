import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewPdfModalView from '../../../../../../views/App/views/Business/views/Quotation/views/PdfModal/PdfModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/quotation/pdf')({
  component: AppViewBusinessViewQuotationViewPdfModalView,
});
