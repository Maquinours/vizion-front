import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { getExternalLinkById } from '../../../../utils/api/externalLink';
import styles from './ExternalLink.module.scss';
import { externalLinkQueryKeys } from '../../../../utils/constants/queryKeys/externalLink';

const routeApi = getRouteApi('/app/external-links/$externalLinkId');

export default function AppViewExternalLinksViewExternalLinkView() {
  const { externalLinkId } = routeApi.useParams();

  const { data: externalLink } = useSuspenseQuery({
    queryKey: externalLinkQueryKeys.detailById(externalLinkId),
    queryFn: () => getExternalLinkById(externalLinkId),
  });

  return (
    <div className={styles.container}>
      <iframe title={externalLink.title} src={externalLink.url!} sandbox={externalLink.type ?? undefined} loading="eager" allowFullScreen />
    </div>
  );
}
