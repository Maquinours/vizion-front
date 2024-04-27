import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewUpdateModalView from '../../../../../views/App/views/Tools/views/Formations/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/formations/update/$formationId')({
  component: AppViewToolsViewFormationsViewUpdateModalView,
});
