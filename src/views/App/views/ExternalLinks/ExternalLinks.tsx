import { useSuspenseQuery } from '@tanstack/react-query';
import ExternalLinkResponseDto from '../../../../utils/types/ExternalLinkResponseDto';
import { getExternalLinksPageByArchiveState } from '../../../../utils/api/externalLink';
import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './ExternalLinks.module.scss';
import { externalLinkQueryKeys } from '../../../../utils/constants/queryKeys/externalLink';
import { useCallback } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const routeApi = getRouteApi('/app/external-links');

const page = 0;
const size = 12;
const archived = false;

export default function AppViewExternalLinksView() {
  const { data } = useSuspenseQuery({
    queryKey: externalLinkQueryKeys.pageByArchiveState(archived, page, size),
    queryFn: () => getExternalLinksPageByArchiveState(archived, page, size),
  });

  const renderLinkChildren = useCallback((item: ExternalLinkResponseDto) => {
    return (
      <>
        <div className={styles.link_card_title}>{item.title}</div>
        <div className={styles.link_card_content}>{parse(DOMPurify.sanitize(item.description))}</div>
      </>
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header_title}>
        <h2>Ressources externes</h2>
      </div>

      <div className={styles.links_container}>
        {data.content.map((item) =>
          item.targetType === 'INTERN' ? (
            <Link
              key={item.id}
              from={routeApi.id}
              to={'./$externalLinkId'}
              params={(old) => ({ ...old, externalLinkId: item.id })}
              className={styles.link_card}
            >
              {renderLinkChildren(item)}
            </Link>
          ) : (
            <a key={item.id} href={item.url!} target="_blank" rel="noreferrer" className={styles.link_card}>
              {renderLinkChildren(item)}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
