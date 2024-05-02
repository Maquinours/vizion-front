import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewVvaListView from '../../../../views/App/views/Tools/views/VvaList/VvaList';

export const Route = createLazyFileRoute('/app/tools/vva')({
  component: AppViewToolsViewVvaListView,
});
