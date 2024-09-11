import { getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import Page from '../../../../../../../../utils/types/Page';
import styles from './Pagination.module.scss';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

type AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponentProps = Readonly<{ data: Page<TaskResponseDto> | undefined }>;
export default function AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponent({
  data,
}: AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponentProps) {
  const { otherPersonalTaskPage: page } = Route.useSearch();

  return (
    <div className={styles.container}>
      <PaginationComponent
        page={page}
        totalPages={data?.totalPages}
        pageLink={(page) => ({
          from: Route.id,
          search: (old) => ({ ...old, otherPersonalTaskPage: page }),
          replace: true,
          resetScroll: false,
        })}
      />
    </div>
  );
}
