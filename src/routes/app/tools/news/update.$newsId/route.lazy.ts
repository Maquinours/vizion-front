import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewNewsViewUpdateModalView from '../../../../../views/App/views/Tools/views/News/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/news/update/$newsId')({
  component: AppViewToolsViewNewsViewUpdateModalView,
});
