import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewExternalLinksView from '../../../views/App/views/ExternalLinks/ExternalLinks';

export const Route = createLazyFileRoute('/app/external-links')({
  component: AppViewExternalLinksView,
});
