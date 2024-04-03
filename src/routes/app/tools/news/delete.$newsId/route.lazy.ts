import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewNewsViewDeleteModalView from '../../../../../views/App/views/Tools/views/News/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/news/delete/$newsId')({
  component: AppViewToolsViewNewsViewDeleteModalView,
});
