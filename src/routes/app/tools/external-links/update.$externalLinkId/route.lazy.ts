import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewExternalLinksViewUpdateModalView from '../../../../../views/App/views/Tools/views/ExternalLinks/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/external-links/update/$externalLinkId')({
  component: AppViewToolsViewExternalLinksViewUpdateModalView,
});
