import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import styles from './ExternalLink.module.scss';
import { externalLinks } from '../../../../utils/constants/queryKeys/externalLink';

const routeApi = getRouteApi('/app/external-links_/$externalLinkId');

export default function AppViewExternalLinksViewExternalLinkView() {
  const { externalLinkId } = routeApi.useParams();

  const { data: externalLink } = useSuspenseQuery(externalLinks.detail._ctx.byId(externalLinkId));

  return (
    <div className={styles.container}>
      <iframe
        title={externalLink.title}
        src={externalLink.url!}
        sandbox={externalLink.type ?? undefined}
        loading="eager"
        allowFullScreen
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
