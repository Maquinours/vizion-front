import AppViewTabsContainerComponent from './components/TabsContainer/TabsContainer';
import AppViewTopbarComponent from './components/Topbar/Topbar';
import styles from './App.module.scss';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import AppViewSidebarComponent from './components/Sidebar/Sidebar';
import AppViewFooterComponent from './components/Footer/Footer';
import { useAuthentifiedUserQuery } from './utils/functions/getAuthentifiedUser';

const Route = getRouteApi('/app');

export default function AppLayout() {
  const { showMobileMenu } = Route.useSearch();

  useAuthentifiedUserQuery();

  return (
    <>
      <div className={styles.container}>
        <AppViewTopbarComponent />
        <main className={classNames(styles.content, { [styles.mobile_menu_opened]: showMobileMenu })}>
          <div className={styles.wrapper}>
            <AppViewTabsContainerComponent />
            <div className={styles.outlet_container}>
              <Outlet />
            </div>
          </div>
        </main>
        <AppViewSidebarComponent />
        <AppViewFooterComponent />
      </div>
      {/* <ChatWebsocketSystem currentUser={currentUser} addTab={addTab} /> // TODO: Reimplement this */}
    </>
  );
}
