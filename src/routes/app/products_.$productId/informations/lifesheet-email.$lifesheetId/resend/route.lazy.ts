import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewLifesheetEmailModalViewResendModalView from '../../../../../../views/App/views/Product/views/Informations/views/LifesheetEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/lifesheet-email/$lifesheetId/resend')({
  component: AppViewProductViewInformationsViewLifesheetEmailModalViewResendModalView,
});
