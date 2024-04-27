import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewCreditsViewDetailsModalView from '../../../../../views/App/views/Tools/views/Credit/views/DetailsModal/DetailsModal';

export const Route = createLazyFileRoute('/app/tools/credit/details')({
  component: AppViewToolsViewCreditsViewDetailsModalView,
});
