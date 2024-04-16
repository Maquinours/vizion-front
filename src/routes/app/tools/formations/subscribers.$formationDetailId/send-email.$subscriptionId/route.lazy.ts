import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewSubscribersModalViewSendEmailModalView from '../../../../../../views/App/views/Tools/views/Formations/views/SubscribersModal/views/SendEmailModal/SendEmailModal';

export const Route = createLazyFileRoute('/app/tools/formations/subscribers/$formationDetailId/send-email/$subscriptionId')({
  component: AppViewToolsViewFormationsViewSubscribersModalViewSendEmailModalView,
});
