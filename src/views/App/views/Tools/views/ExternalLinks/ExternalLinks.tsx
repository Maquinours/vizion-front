import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { externalLinks } from '../../../../../../utils/constants/queryKeys/externalLink';
import AppViewToolsViewExternalLinksViewTableComponent from './components/Table/Table';
import styles from './ExternalLinks.module.scss';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';

const routeApi = getRouteApi('/app/tools/external-links');

const size = 15;

export default function AppViewToolsViewExternalLinksView() {
  const { page, archiveState } = routeApi.useSearch();

  const { data, isLoading } = useQuery(externalLinks.page({ page, size })._ctx.byArchiveState(archiveState));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <Link from={routeApi.id} to="./create" search={(old) => old} className="btn btn-secondary">
                Ajouter
              </Link>
              <Link from={routeApi.id} search={(old) => ({ ...old, archiveState: !archiveState })} className="btn btn-secondary" style={{ marginLeft: '3px' }}>
                {archiveState ? 'Voir non archivés' : 'Voir archivés'}
              </Link>
            </div>
          </div>
          <AppViewToolsViewExternalLinksViewTableComponent data={data?.content} isLoading={isLoading} />
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), params: {} })}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
