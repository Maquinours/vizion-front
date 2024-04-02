import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewExternalLinksViewDeleteModalView from '../../../../../views/App/views/Tools/views/ExternalLinks/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/external-links/delete/$externalLinkId')({
  component: AppViewToolsViewExternalLinksViewDeleteModalView,
});
