import TasksCountsResponseDto from '../../../../../../../../utils/types/TasksCountsResponseDto';
import styles from './Header.module.scss';
import AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentTopComponent from './components/Top/Top';
import AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentUsersComponent from './components/Users/Users';

type Props = Readonly<{
  counts: TasksCountsResponseDto | undefined;
}>;
export default function AppViewDashboardViewPersonalTasksComponentHeaderComponent({ counts }: Props) {
  return (
    <div className={styles.header_container}>
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentTopComponent counts={counts} />
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentUsersComponent />
    </div>
  );
}
