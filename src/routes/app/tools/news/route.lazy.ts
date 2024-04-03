import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewNewsView from '../../../../views/App/views/Tools/views/News/News';

export const Route = createLazyFileRoute('/app/tools/news')({
  component: AppViewToolsViewNewsView,
});
