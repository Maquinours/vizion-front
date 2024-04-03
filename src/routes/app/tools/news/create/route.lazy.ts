import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewNewsViewCreateModalView from '../../../../../views/App/views/Tools/views/News/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/news/create')({
  component: AppViewToolsViewNewsViewCreateModalView,
});
