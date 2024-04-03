import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDdnsView from '../../../../views/App/views/Tools/views/Ddns/Ddns';

export const Route = createLazyFileRoute('/app/tools/ddns')({
  component: AppViewToolsViewDdnsView,
});
