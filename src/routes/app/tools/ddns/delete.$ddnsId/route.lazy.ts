import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDdnsViewDeleteModalView from '../../../../../views/App/views/Tools/views/Ddns/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/ddns/delete/$ddnsId')({
  component: AppViewToolsViewDdnsViewDeleteModalView,
});
