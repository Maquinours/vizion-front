import * as Sentry from '@sentry/react';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import styles from './App.module.scss';
import AppViewBusinessGedModalComponent from './components/BusinessGedModal/BusinessGedModal';
import AppViewChatWebsocketComponent from './components/ChatWebsocket/ChatWebsocket';
import AppViewCreateBusinessModalComponent from './components/CreateBusinessModal/CreateBusinessModal';
import AppViewCreateClientBusinessModalComponent from './components/CreateClientBusinessModal/CreateClientBusinessModal';
import AppViewFooterComponent from './components/Footer/Footer';
import AppViewLoadingProgressBarComponent from './components/LoadingProgressBar/LoadingProgressBar';
import AppViewSidebarComponent from './components/Sidebar/Sidebar';
import AppViewTabsContainerComponent from './components/TabsContainer/TabsContainer';
import AppViewTopbarComponent from './components/Topbar/Topbar';
import { useAuthentifiedUserQuery } from './utils/functions/getAuthentifiedUser';
import AppViewSendEmailModalComponent from './components/SendEmailModal/SendEmailModal';
import AppViewTitleManagerComponent from './components/TitleManager/TitleManager';

const routeApi = getRouteApi('/app');

export default function AppLayout() {
  const { mobileSidebar, appModal: modalId } = routeApi.useSearch();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const modal = useMemo(() => {
    switch (modalId) {
      case 'create-business':
        return <AppViewCreateBusinessModalComponent />;
      case 'create-client-business':
        return <AppViewCreateClientBusinessModalComponent />;
      case 'send-email':
        return <AppViewSendEmailModalComponent />;
      default:
        if (modalId?.startsWith('business-ged')) return <AppViewBusinessGedModalComponent />;
    }
  }, [modalId]);

  useEffect(() => {
    Sentry.setUser({
      id: authentifiedUser.profile.id,
      firstName: authentifiedUser.profile.firstName,
      lastName: authentifiedUser.profile.lastName,
      username: authentifiedUser.userInfo.username,
      email: authentifiedUser.profile.email ?? undefined,
    });
  }, [
    authentifiedUser.profile.id,
    authentifiedUser.profile.firstName,
    authentifiedUser.profile.lastName,
    authentifiedUser.userInfo.username,
    authentifiedUser.profile.email,
  ]);

  return (
    <>
      <AppViewLoadingProgressBarComponent />
      <AppViewChatWebsocketComponent />
      <AppViewTitleManagerComponent />
      <div className={styles.container}>
        <AppViewTopbarComponent />
        <main className={classNames(styles.content, { [styles.mobile_menu_opened]: mobileSidebar })}>
          <div className={styles.wrapper}>
            <AppViewTabsContainerComponent>
              <div className={styles.outlet_container}>
                <Outlet />
              </div>
              {modal}
            </AppViewTabsContainerComponent>
          </div>
        </main>
        <AppViewSidebarComponent />
        <AppViewFooterComponent />
      </div>
    </>
  );
}
