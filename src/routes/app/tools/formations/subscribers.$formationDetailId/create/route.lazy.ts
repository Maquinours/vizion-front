import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewSubscribersModalViewCreateModalView from '../../../../../../views/App/views/Tools/views/Formations/views/SubscribersModal/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/formations/subscribers/$formationDetailId/create')({
  component: AppViewToolsViewFormationsViewSubscribersModalViewCreateModalView,
});
