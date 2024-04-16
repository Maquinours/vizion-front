import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewUpdateModalViewAddDetailModalView from '../../../../../../views/App/views/Tools/views/Formations/views/UpdateModal/views/AddDetailModal/AddDetailModal';

export const Route = createLazyFileRoute('/app/tools/formations/update/$formationId/add-detail')({
  component: AppViewToolsViewFormationsViewUpdateModalViewAddDetailModalView,
});
