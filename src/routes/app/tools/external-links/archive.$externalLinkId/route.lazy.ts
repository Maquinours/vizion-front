import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewExternalLinksViewArchiveModalView from '../../../../../views/App/views/Tools/views/ExternalLinks/views/ArchiveModal/ArchiveModal';

export const Route = createLazyFileRoute('/app/tools/external-links/archive/$externalLinkId')({
  component: AppViewToolsViewExternalLinksViewArchiveModalView,
});
