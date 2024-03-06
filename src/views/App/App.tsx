import AppViewTabsContainerComponent from './components/TabsContainer/TabsContainer';
import AppViewTopbarComponent from './components/Topbar/Topbar';
import styles from './App.module.scss';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import AppViewSidebarComponent from './components/Sidebar/Sidebar';
import AppViewFooterComponent from './components/Footer/Footer';
import AppViewBusinessGedModalComponent from './components/BusinessGedModal/BusinessGedModal';
import AppViewCreateBusinessModalComponent from './components/CreateBusinessModal/CreateBusinessModal';
import AppViewCreateClientBusinessModalComponent from './components/CreateClientBusinessModal/CreateClientBusinessModal';

const Route = getRouteApi('/app');

export default function AppLayout() {
  const { mobileSidebar, appModal: modalId } = Route.useSearch();

  const modal = (() => {
    switch (modalId) {
      case 'create-business':
        return <AppViewCreateBusinessModalComponent />;
      case 'create-client-business':
        return <AppViewCreateClientBusinessModalComponent />;
      default:
        if (modalId?.startsWith('business-ged')) return <AppViewBusinessGedModalComponent />;
    }
  })();

  return (
    <>
      <div className={styles.container}>
        <AppViewTopbarComponent />
        <main className={classNames(styles.content, { [styles.mobile_menu_opened]: mobileSidebar })}>
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
      {modal}
      {/* <ChatWebsocketSystem currentUser={currentUser} addTab={addTab} /> // TODO: Reimplement this */}
    </>
  );
}
