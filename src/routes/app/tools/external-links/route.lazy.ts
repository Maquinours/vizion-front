import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewExternalLinksView from '../../../../views/App/views/Tools/views/ExternalLinks/ExternalLinks';

export const Route = createLazyFileRoute('/app/tools/external-links')({
  component: AppViewToolsViewExternalLinksView,
});
