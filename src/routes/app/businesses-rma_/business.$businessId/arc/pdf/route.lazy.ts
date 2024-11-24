import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewArcViewPdfModalView from '../../../../../../views/App/views/Business/views/Arc/views/PdfModal/PdfModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/arc/pdf')({
  component: AppViewBusinessViewArcViewPdfModalView,
});
