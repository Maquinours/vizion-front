import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsView from '../../../../views/App/views/Tools/views/Formations/Formations';

export const Route = createLazyFileRoute('/app/tools/formations')({
  component: AppViewToolsViewFormationsView,
});
