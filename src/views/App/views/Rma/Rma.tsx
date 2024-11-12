import { Outlet, getRouteApi } from '@tanstack/react-router';
import styles from './Rma.module.scss';
import AppViewRmaViewSidebarComponent from './components/Sidebar/Sidebar';
import { useMemo } from 'react';
import AppViewRmaViewArchiveModalComponent from './components/ArchiveModal/ArchiveModal';
import AppViewRmaViewBeforeCloseModalView from './components/BeforeCloseModal/BeforeCloseModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId');

export default function AppViewRmaView() {
  const { rmaModal } = routeApi.useSearch();

  const modal = useMemo(() => {
    switch (rmaModal) {
      case 'archive':
        return <AppViewRmaViewArchiveModalComponent />;
      case 'before-close':
        return <AppViewRmaViewBeforeCloseModalView />;
      default:
        return null;
    }
  }, [rmaModal]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_grid}>
          <div className={styles.grid_one}>
            <AppViewRmaViewSidebarComponent />
          </div>
          <div className={styles.grid_two}>
            <Outlet />
          </div>
        </div>
      </div>
      {modal}
    </>
  );
}
