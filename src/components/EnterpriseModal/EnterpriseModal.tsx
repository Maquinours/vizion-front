import { useSuspenseQuery } from '@tanstack/react-query';
import { enterprises } from '../../utils/constants/queryKeys/enterprise';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import EnterpriseModalComponentAllBusinessTableComponent from './components/AllBusinessTable/AllBusinessTable';
import EnterpriseModalComponentCategoryComponent from './components/Category/Category';
import EnterpriseModalComponentContactsComponent from './components/Contacts/Contacts';
import EnterpriseComponentHeaderComponent from './components/Header/Header';
import EnterpriseComponentInformationsComponent from './components/Informations/Informations';

import { Suspense, useState } from 'react';
import ReactModal from 'react-modal';
import BusinessModalComponent from '../BusinessModal/BusinessModal';
import styles from './EnterpriseModal.module.scss';
import LoaderModal from '../LoaderModal/LoaderModal';

enum EnterpriseModal {
  BUSINESS,
}

type EnterpriseModalData = {
  modal: EnterpriseModal.BUSINESS;
  businessId: string;
};

type EnterpriseModalComponentProps = Readonly<{
  enterpriseId: string;
}>;
export default function EnterpriseModalComponent({ enterpriseId }: EnterpriseModalComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const [modal, setModal] = useState<EnterpriseModalData>();

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
              openBusinessModal={(businessId: string) => setModal({ modal: EnterpriseModal.BUSINESS, businessId })}
            />
          </div>
        </div>
        <div className={styles.grid_two}>
          <EnterpriseModalComponentContactsComponent enterprise={enterprise} />
          {/* <AppViewEnterpriseViewLifesheetComponent />
          <AppViewEnterpriseViewWorkloadsComponent /> */}
        </div>
      </div>
      <Suspense fallback={<LoaderModal />}>
        {modal?.modal === EnterpriseModal.BUSINESS && <BusinessModalComponent businessId={modal.businessId} onClose={() => setModal(undefined)} />}
      </Suspense>
      {/* <Outlet /> */}
    </ReactModal>
  );
}
