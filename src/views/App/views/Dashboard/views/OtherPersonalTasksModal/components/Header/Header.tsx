import TasksCountsResponseDto from '../../../../../../../../utils/types/TasksCountsResponseDto';
import styles from './Header.module.scss';
import AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentTopComponent from './components/Top/Top';
import AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentUsersComponent from './components/Users/Users';

interface Props {
  counts: TasksCountsResponseDto | undefined;
}
export default function AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponent({ counts }: Readonly<Props>) {
  return (
    <div className={styles.header_container}>
      <AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentTopComponent counts={counts} />
      <AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentUsersComponent />
    </div>
  );
}
