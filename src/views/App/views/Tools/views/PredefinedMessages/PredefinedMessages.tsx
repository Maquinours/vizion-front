import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { useQuery } from '@tanstack/react-query';
import { predefinedMessageQueryKeys } from '../../../../../../utils/constants/queryKeys/predefinedMessage';
import { getPredefinedMessagesPage } from '../../../../../../utils/api/predefinedMessage';
import styles from './PredefinedMessages.module.scss';
import AppViewToolsViewPredefinedMessagesViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/tools/predefined-messages');

const size = 15;

export default function AppViewToolsViewPredefinedMessagesView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: predefinedMessageQueryKeys.page(page, size),
    queryFn: () => getPredefinedMessagesPage(page, size),
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="./create" className="btn btn-secondary">
              Ajouter
            </Link>
          </div>

          <div className={styles.table_container}>
            <AppViewToolsViewPredefinedMessagesViewTableComponent data={data?.content} isLoading={isLoading} />
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
