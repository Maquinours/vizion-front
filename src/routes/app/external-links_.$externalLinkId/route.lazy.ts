import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewExternalLinksViewExternalLinkView from '../../../views/App/views/ExternalLink/ExternalLink'

export const Route = createLazyFileRoute(
  '/app/external-links_/$externalLinkId',
)({
  component: AppViewExternalLinksViewExternalLinkView,
})
