import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { externalLinks } from '../../../../utils/constants/queryKeys/externalLink';
import ExternalLinkResponseDto from '../../../../utils/types/ExternalLinkResponseDto';
import styles from './ExternalLinks.module.scss';

const routeApi = getRouteApi('/app/external-links');

const page = 0;
const size = 12;
const archived = false;

const renderLinkChildren = (item: ExternalLinkResponseDto) => {
  return (
    <>
      <div className={styles.link_card_title}>{item.title}</div>
      <div className={styles.link_card_content}>{parse(DOMPurify.sanitize(item.description))}</div>
    </>
  );
};

export default function AppViewExternalLinksView() {
  const { data } = useSuspenseQuery(externalLinks.page({ page, size })._ctx.byArchiveState(archived));

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
