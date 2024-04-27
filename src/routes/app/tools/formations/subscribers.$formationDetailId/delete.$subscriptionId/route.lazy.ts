import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewSubscribersModalViewDeleteModalView from '../../../../../../views/App/views/Tools/views/Formations/views/SubscribersModal/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/formations/subscribers/$formationDetailId/delete/$subscriptionId')({
  component: AppViewToolsViewFormationsViewSubscribersModalViewDeleteModalView,
});
