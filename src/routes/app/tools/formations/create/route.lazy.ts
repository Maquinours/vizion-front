import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewCreateModalView from '../../../../../views/App/views/Tools/views/Formations/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/formations/create')({
  component: AppViewToolsViewFormationsViewCreateModalView,
});
