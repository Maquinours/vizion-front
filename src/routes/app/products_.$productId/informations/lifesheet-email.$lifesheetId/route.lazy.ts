import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewLifesheetEmailModalView from '../../../../../views/App/views/Product/views/Informations/views/LifesheetEmailModal/LifesheetEmailModal';

export const Route = createLazyFileRoute('/app/products/$productId/informations/lifesheet-email/$lifesheetId')({
  component: AppViewProductViewInformationsViewLifesheetEmailModalView,
});
