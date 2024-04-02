import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewExternalLinksViewCreateModalView from '../../../../../views/App/views/Tools/views/ExternalLinks/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/external-links/create')({
  component: AppViewToolsViewExternalLinksViewCreateModalView,
});
