import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewUpdateModalViewDetailsModalView from '../../../../../../views/App/views/Tools/views/Formations/views/UpdateModal/views/DetailsModal/DetailsModal';

export const Route = createLazyFileRoute('/app/tools/formations/update/$formationId/details')({
  component: AppViewToolsViewFormationsViewUpdateModalViewDetailsModalView,
});
