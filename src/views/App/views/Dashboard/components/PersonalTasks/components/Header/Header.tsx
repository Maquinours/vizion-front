import styles from './Header.module.scss';
import AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentTopComponent from './components/Top/Top';
import AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentUsersComponent from './components/Users/Users';

export default function AppViewDashboardViewPersonalTasksComponentHeaderComponent() {
  return (
    <div className={styles.header_container}>
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentTopComponent />
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentHeaderComponentUsersComponent />
    </div>
  );
}
