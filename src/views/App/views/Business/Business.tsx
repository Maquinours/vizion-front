import { Outlet } from '@tanstack/react-router';
import styles from './Business.module.scss';
import AppViewBusinessViewSidebarComponent from './components/Sidebar/Sidebar';
import AppViewBusinessViewArchiveModalComponent from './components/ArchiveModal/ArchiveModal';
import AppViewBusinessViewAssistancesModalComponent from './components/AssistancesModal/AssistancesModal';
import AppViewBusinessViewCreateAssistanceModalComponent from './components/CreateAssistanceModal/CreateAssistanceModal';
import AppViewBusinessViewBeforeCloseModalComponent from './components/BeforeCloseModal/BeforeCloseModal';

export default function AppViewBusinessView() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content_grid}>
          <div className={styles.grid_one}>
            <AppViewBusinessViewSidebarComponent />
          </div>
          <div className={styles.grid_two}>
            <Outlet />
          </div>
        </div>
      </div>
      <AppViewBusinessViewArchiveModalComponent />
      <AppViewBusinessViewAssistancesModalComponent />
      <AppViewBusinessViewCreateAssistanceModalComponent />
      <AppViewBusinessViewBeforeCloseModalComponent />
    </>
  );
}
