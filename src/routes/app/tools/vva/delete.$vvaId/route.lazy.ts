import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewVvaListViewDeleteModalView from '../../../../../views/App/views/Tools/views/VvaList/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/vva/delete/$vvaId')({
  component: AppViewToolsViewVvaListViewDeleteModalView,
});
