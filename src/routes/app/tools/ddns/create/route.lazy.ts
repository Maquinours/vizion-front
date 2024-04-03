import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDdnsViewCreateModalView from '../../../../../views/App/views/Tools/views/Ddns/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/ddns/create')({
  component: AppViewToolsViewDdnsViewCreateModalView,
});
