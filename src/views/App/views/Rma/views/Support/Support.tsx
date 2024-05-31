import { Outlet } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Support.module.scss';
import AppViewRmaViewSupportViewGedComponent from './components/Ged/Ged';
import AppViewRmaViewSupportViewHeaderComponent from './components/Header/Header';
import AppViewRmaViewSupportViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewRmaViewSupportViewReturnAddressComponent from './components/ReturnAddress/ReturnAddress';
import AppViewRmaViewSupportViewTableComponent from './components/Table/Table';
import AppViewRmaViewSupportViewTasksComponent from './components/Tasks/Tasks';

export default function AppViewRmaViewSupportView() {
  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  return (
    <>
      <div className={styles.container}>
        <AppViewRmaViewSupportViewHeaderComponent />
        <div className={styles.grid}>
          <AppViewRmaViewSupportViewTableComponent />
          <AppViewRmaViewSupportViewReturnAddressComponent />
        </div>
        <div className={styles.second_grid}>
          <AppViewRmaViewSupportViewLifesheetComponent />
          <AppViewRmaViewSupportViewGedComponent />
          {authentifiedUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
            <AppViewRmaViewSupportViewTasksComponent />
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
