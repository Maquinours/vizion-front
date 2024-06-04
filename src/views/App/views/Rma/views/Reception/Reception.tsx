import { Outlet } from '@tanstack/react-router';
import styles from './Reception.module.scss';
import AppViewRmaViewReceptionViewHeaderComponent from './components/Header/Header';
import AppViewRmaViewReceptionViewTableComponent from './components/Table/Table';
import AppViewRmaViewReceptionViewFooterComponent from './components/Footer/Footer';

export default function AppViewRmaViewReceptionView() {
  return (
    <>
      <div className={styles.container}>
        <AppViewRmaViewReceptionViewHeaderComponent />
        <div className={styles.grid}>
          <AppViewRmaViewReceptionViewTableComponent />
          <AppViewRmaViewReceptionViewFooterComponent />
        </div>
      </div>
      <Outlet />
    </>
  );
}
