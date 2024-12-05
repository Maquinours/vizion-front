import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import styles from './ExternalLink.module.scss';
import { externalLinks } from '../../../../utils/constants/queryKeys/externalLink';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/external-links_/$externalLinkId');

export default function AppViewExternalLinksViewExternalLinkView() {
  const router = useRouter();
  const navigate = routeApi.useNavigate();

  const { externalLinkId } = routeApi.useParams();

  const { data: externalLink } = useSuspenseQuery(externalLinks.detail._ctx.byId(externalLinkId));

  useEffect(() => {
    if (externalLink.targetType === 'EXTERN') {
      window.open(externalLink.url!, '_blank');
      if (router.history.length > 2)
        router.history.back(); // If we have another route before it, we go back to it
      else navigate({ to: '/app' }); // Otherwise, we go back to the home page
    }
  }, [externalLink.targetType]);

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
