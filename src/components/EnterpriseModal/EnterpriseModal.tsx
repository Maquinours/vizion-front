import { useSuspenseQuery } from '@tanstack/react-query';
import { enterprises } from '../../utils/constants/queryKeys/enterprise';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import EnterpriseModalComponentAllBusinessTableComponent from './components/AllBusinessTable/AllBusinessTable';
import EnterpriseModalComponentCategoryComponent from './components/Category/Category';
import EnterpriseModalComponentContactsComponent from './components/Contacts/Contacts';
import EnterpriseComponentHeaderComponent from './components/Header/Header';
import EnterpriseComponentInformationsComponent from './components/Informations/Informations';

import { Suspense, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import BusinessModalComponent from '../BusinessModal/BusinessModal';
import styles from './EnterpriseModal.module.scss';
import LoaderModal from '../LoaderModal/LoaderModal';
import RmaModalComponent from '../RmaModal/RmaModal';

enum EnterpriseModal {
  BUSINESS,
  RMA,
}

type EnterpriseModalData =
  | {
      modal: EnterpriseModal.BUSINESS;
      businessId: string;
    }
  | { modal: EnterpriseModal.RMA; rmaId: string };

type EnterpriseModalComponentProps = Readonly<{
  enterpriseId: string;
  defaultContactsSearch?: string;
  defaultAllBusinessProfileId?: string;
}>;
export default function EnterpriseModalComponent({ enterpriseId, defaultContactsSearch, defaultAllBusinessProfileId }: EnterpriseModalComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const [modalData, setModalData] = useState<EnterpriseModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case EnterpriseModal.BUSINESS:
        return <BusinessModalComponent businessId={modalData.businessId} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.RMA:
        return <RmaModalComponent rmaId={modalData.rmaId} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData]);

  return (
    <ReactModal isOpen className={styles.modal} overlayClassName="Overlay">
      <EnterpriseComponentHeaderComponent enterprise={enterprise} />
      <div className={styles.info_section}>
        <div className={styles.grid_one}>
          <div className={styles.one}>
            <EnterpriseComponentInformationsComponent enterprise={enterprise} />
            {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
              <EnterpriseModalComponentCategoryComponent enterprise={enterprise} />
            )}
            {/* {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppViewEnterpriseViewGedComponent />} */}
          </div>
          <div className={styles.two}>
            <EnterpriseModalComponentAllBusinessTableComponent
              enterprise={enterprise}
              openBusinessModal={(businessId: string) => setModalData({ modal: EnterpriseModal.BUSINESS, businessId })}
              openRmaModal={(rmaId: string) => setModalData({ modal: EnterpriseModal.RMA, rmaId })}
              defaultAllBusinessProfileId={defaultAllBusinessProfileId}
            />
          </div>
        </div>
        <div className={styles.grid_two}>
          <EnterpriseModalComponentContactsComponent enterprise={enterprise} defaultContactsSearch={defaultContactsSearch} />
          {/* <AppViewEnterpriseViewLifesheetComponent />
          <AppViewEnterpriseViewWorkloadsComponent /> */}
        </div>
      </div>
      <Suspense fallback={<LoaderModal />}>{modal}</Suspense>
      {/* <Outlet /> */}
    </ReactModal>
  );
}
