import styles from './Header.module.scss';
import AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentTopComponent from './components/Top/Top';
import AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentUsersComponent from './components/Users/Users';

export default function AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponent() {
  return (
    <div className={styles.header_container}>
      <AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentTopComponent />
      <AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentUsersComponent />
    </div>
  );
}
