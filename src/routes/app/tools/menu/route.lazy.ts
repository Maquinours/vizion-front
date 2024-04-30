import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsMenuView from '../../../../views/App/views/Tools/views/Menu/Menu';

export const Route = createLazyFileRoute('/app/tools/menu')({
  component: AppViewToolsMenuView,
});
