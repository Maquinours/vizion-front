import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewVvaListViewCreateModalView from '../../../../../views/App/views/Tools/views/VvaList/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/vva/create')({
  component: AppViewToolsViewVvaListViewCreateModalView,
});
