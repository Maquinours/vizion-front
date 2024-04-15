import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewCreditsViewShowModalView from '../../../../../views/App/views/Tools/views/Credit/views/ShowModal/ShowModal';

export const Route = createLazyFileRoute('/app/tools/credit/show')({
  component: AppViewToolsViewCreditsViewShowModalView,
});
