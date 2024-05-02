import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewSubscribersModalView from '../../../../../views/App/views/Tools/views/Formations/views/SubscribersModal/SubscribersModal';

export const Route = createLazyFileRoute('/app/tools/formations/subscribers/$formationDetailId')({
  component: AppViewToolsViewFormationsViewSubscribersModalView,
});
