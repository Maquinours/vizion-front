import { getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import Page from '../../../../../../../../utils/types/Page';
import styles from './Pagination.module.scss';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';

const routeApi = getRouteApi('/app/dashboard');

type AppViewDashboardViewPersonalTasksComponentPaginationComponentProps = Readonly<{ data: Page<TaskResponseDto> | undefined }>;
export default function AppViewDashboardViewPersonalTasksComponentPaginationComponent({
  data,
}: AppViewDashboardViewPersonalTasksComponentPaginationComponentProps) {
  const { personalTaskPage: page } = routeApi.useSearch();

  return (
    <div className={styles.container}>
      <PaginationComponent
        page={page}
        totalPages={data?.totalPages}
        pageLink={(page) => ({
          from: routeApi.id,
          to: routeApi.id,
          search: (old) => ({ ...old, personalTaskPage: page }),
          preload: 'intent',
          replace: true,
          resetScroll: false,
        })}
      />
    </div>
  );
}
