import * as Sentry from '@sentry/react';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
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
import AppViewAircallIntegrationComponent from './components/AircallIntegration/AircallIntegration';
import AppViewAircallWorkspaceComponent from './components/AircallWorkspace/AircallWorkspace';
import EnterpriseModalComponent from '../../components/EnterpriseModal/EnterpriseModal';

const routeApi = getRouteApi('/app');

enum ModalType {
  ENTERPRISE,
}

type ModalData = { modal: ModalType.ENTERPRISE; enterpriseId: string; defaultContactsSearch?: string; defaultAllBusinessProfileId?: string };

export default function AppLayout() {
  const { mobileSidebar, appModal: modalId } = routeApi.useSearch();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const [modalData, setModalData] = useState<ModalData | undefined>({ modal: ModalType.ENTERPRISE, enterpriseId: 'f8ac7d99-5ac1-42bc-ace2-bad6aaf14bea' });

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
      <AppViewAircallIntegrationComponent
        openEnterpriseModal={(enterpriseId, { defaultContactsSearch, defaultAllBusinessProfileId }) =>
          setModalData({ modal: ModalType.ENTERPRISE, enterpriseId, defaultContactsSearch, defaultAllBusinessProfileId })
        }
      />
      <AppViewAircallWorkspaceComponent>
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
        {modalData?.modal === ModalType.ENTERPRISE && (
          <EnterpriseModalComponent
            enterpriseId={modalData.enterpriseId}
            defaultContactsSearch={modalData.defaultContactsSearch}
            defaultAllBusinessProfileId={modalData.defaultAllBusinessProfileId}
            onClose={() => setModalData(undefined)}
          />
        )}
      </AppViewAircallWorkspaceComponent>
    </>
  );
}
