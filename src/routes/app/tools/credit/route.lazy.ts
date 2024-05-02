import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewCreditsView from '../../../../views/App/views/Tools/views/Credit/Credit';

export const Route = createLazyFileRoute('/app/tools/credit')({
  component: AppViewToolsViewCreditsView,
});
