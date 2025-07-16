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
import EnterpriseModalComponentGedComponent from './components/Ged/Ged';
import RenameGedObjectModalComponent from '../RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../utils/enums/FileType';
import CreateGedDirectoryModalComponent from '../CreateGedDirectoryModal/CreateGedDirectoryModal';
import ImportGedFilesModalComponent from '../ImportGedFilesModal/ImportGedFilesModal';
import DeleteGedObjectModalComponent from '../DeleteGedObjectModal/DeleteGedObjectModal';
import CreateLifesheetModalComponent from '../CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import EnterpriseModalComponentLifesheetComponent from './components/Lifesheet/Lifesheet';
import EnterpriseModalComponentWorkloadsComponent from './components/Workloads/Workloads';
import UnlinkWorkloadModalComponent from '../UnlinkWorkloadModal/UnlinkWorkloadModal';
import EnterpriseModalComponentEmailModalComponent from './components/EmailModal/EmailModal';
import EnterpriseModalComponentEmailHistoryModalComponent from './components/EmailHistoryModal/EmailHistoryModal';
import CreateBusinessModalComponent from '../CreateBusinessModal/CreateBusinessModal';
import ProfileResponseDto from '../../utils/types/ProfileResponseDto';
import SendEmailModalComponent from '../SendEmailModal/SendEmailModal';
import DeleteContactModalComponent from '../DeleteContactModal/DeleteContactModal';
import UpdateContactModalComponent from '../UpdateContactModal/UpdateContactModal';
import UpdateContactPasswordModalComponent from '../UpdateContactPasswordModal/UpdateContactPasswordModal';
import EnterpriseModalComponentImportContactsModalComponent from './components/ImportContactsModal/ImportContactsModal';
import CreateContactModalComponent from '../CreateContactModal/CreateContactModal';

enum EnterpriseModal {
  BUSINESS,
  RMA,
  RENAME_GED_OBJECT,
  CREATE_GED_DIRECTORY,
  IMPORT_GED_FILES,
  DELETE_GED_OBJECT,
  CREATE_LIFESHEET,
  UNLINK_TASK,
  EMAIL,
  EMAIL_HISTORY,
  CREATE_CONTACT_BUSINESS,
  SEND_EMAIL_TO_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  UPDATE_CONTACT_PASSWORD,
  CONTACT_EMAIL_HISTORY,
  IMPORT_CONTACTS,
  CREATE_CONTACT,
}

type EnterpriseModalData =
  | {
      modal: EnterpriseModal.BUSINESS;
      businessId: string;
    }
  | { modal: EnterpriseModal.RMA; rmaId: string }
  | {
      modal: EnterpriseModal.RENAME_GED_OBJECT;
      objectRelativePath: string;
    }
  | {
      modal: EnterpriseModal.CREATE_GED_DIRECTORY;
      directoryRelativePath: string;
    }
  | {
      modal: EnterpriseModal.IMPORT_GED_FILES;
      directoryRelativePath: string;
    }
  | {
      modal: EnterpriseModal.DELETE_GED_OBJECT;
      objectRelativePath: string;
    }
  | {
      modal: EnterpriseModal.CREATE_LIFESHEET;
    }
  | {
      modal: EnterpriseModal.UNLINK_TASK;
      taskId: string;
    }
  | {
      modal: EnterpriseModal.EMAIL;
      emailId: string;
    }
  | {
      modal: EnterpriseModal.EMAIL_HISTORY;
    }
  | {
      modal: EnterpriseModal.CREATE_CONTACT_BUSINESS;
      contact: ProfileResponseDto;
    }
  | {
      modal: EnterpriseModal.SEND_EMAIL_TO_CONTACT;
      contact: ProfileResponseDto;
    }
  | {
      modal: EnterpriseModal.DELETE_CONTACT;
      contact: ProfileResponseDto;
    }
  | {
      modal: EnterpriseModal.UPDATE_CONTACT;
      contact: ProfileResponseDto;
    }
  | {
      modal: EnterpriseModal.UPDATE_CONTACT_PASSWORD;
      contact: ProfileResponseDto;
    }
  | {
      modal: EnterpriseModal.CONTACT_EMAIL_HISTORY;
      contact: ProfileResponseDto;
    }
  | {
      modal: EnterpriseModal.IMPORT_CONTACTS;
    }
  | { modal: EnterpriseModal.CREATE_CONTACT };

type EnterpriseModalComponentProps = Readonly<{
  enterpriseId: string;
  defaultContactsSearch?: string;
  defaultAllBusinessProfileId?: string;
  onClose: () => void;
}>;
export default function EnterpriseModalComponent({ enterpriseId, defaultContactsSearch, defaultAllBusinessProfileId, onClose }: EnterpriseModalComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const [modalData, setModalData] = useState<EnterpriseModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case EnterpriseModal.BUSINESS:
        return <BusinessModalComponent businessId={modalData.businessId} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.RMA:
        return <RmaModalComponent rmaId={modalData.rmaId} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.RENAME_GED_OBJECT:
        return (
          <RenameGedObjectModalComponent
            type={FileType.CONTACT}
            id={enterprise.id}
            objectRelativePath={modalData.objectRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case EnterpriseModal.CREATE_GED_DIRECTORY:
        return (
          <CreateGedDirectoryModalComponent
            type={FileType.CONTACT}
            id={enterprise.id}
            directoryRelativePath={modalData.directoryRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case EnterpriseModal.IMPORT_GED_FILES:
        return (
          <ImportGedFilesModalComponent
            type={FileType.CONTACT}
            id={enterprise.id}
            directoryRelativePath={modalData.directoryRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case EnterpriseModal.DELETE_GED_OBJECT:
        return (
          <DeleteGedObjectModalComponent
            type={FileType.CONTACT}
            id={enterprise.id}
            objectRelativePath={modalData.objectRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case EnterpriseModal.CREATE_LIFESHEET:
        return (
          <CreateLifesheetModalComponent
            associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
            associatedItemId={enterprise.id}
            onClose={() => setModalData(undefined)}
          />
        );
      case EnterpriseModal.UNLINK_TASK:
        return <UnlinkWorkloadModalComponent taskId={modalData.taskId} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.EMAIL:
        return <EnterpriseModalComponentEmailModalComponent emailId={modalData.emailId} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.EMAIL_HISTORY:
        return <EnterpriseModalComponentEmailHistoryModalComponent enterprise={enterprise} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.CREATE_CONTACT_BUSINESS:
        return <CreateBusinessModalComponent contactId={modalData.contact.id} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.SEND_EMAIL_TO_CONTACT:
        return <SendEmailModalComponent isOpen={true} defaultRecipient={[modalData.contact.email!]} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.DELETE_CONTACT:
        return <DeleteContactModalComponent contactId={modalData.contact.id} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.UPDATE_CONTACT:
        return <UpdateContactModalComponent contactId={modalData.contact.id} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.UPDATE_CONTACT_PASSWORD:
        return <UpdateContactPasswordModalComponent contactId={modalData.contact.id} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.CONTACT_EMAIL_HISTORY:
        return (
          <EnterpriseModalComponentEmailHistoryModalComponent
            enterprise={enterprise}
            onClose={() => setModalData(undefined)}
            defaultAddresses={[modalData.contact.email!.toLowerCase()]}
          />
        );
      case EnterpriseModal.IMPORT_CONTACTS:
        return <EnterpriseModalComponentImportContactsModalComponent enterprise={enterprise} onClose={() => setModalData(undefined)} />;
      case EnterpriseModal.CREATE_CONTACT:
        return <CreateContactModalComponent enterpriseId={enterprise.id} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData]);

  return (
    <ReactModal isOpen className={styles.modal} overlayClassName="Overlay" onRequestClose={onClose}>
      <EnterpriseComponentHeaderComponent enterprise={enterprise} onEmailHistoryClick={() => setModalData({ modal: EnterpriseModal.EMAIL_HISTORY })} />
      <div className={styles.info_section}>
        <div className={styles.grid_one}>
          <div className={styles.one}>
            <EnterpriseComponentInformationsComponent enterprise={enterprise} />
            {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
              <EnterpriseModalComponentCategoryComponent enterprise={enterprise} />
            )}
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <EnterpriseModalComponentGedComponent
                enterprise={enterprise}
                onCreateDirectoryClick={(data) =>
                  setModalData({ modal: EnterpriseModal.CREATE_GED_DIRECTORY, directoryRelativePath: data?.relativePath ?? '' })
                }
                onImportFilesClick={(data) => setModalData({ modal: EnterpriseModal.IMPORT_GED_FILES, directoryRelativePath: data?.relativePath ?? '' })}
                onDeleteClick={(data) => setModalData({ modal: EnterpriseModal.DELETE_GED_OBJECT, objectRelativePath: data.relativePath })}
                onRenameClick={(data) => setModalData({ modal: EnterpriseModal.RENAME_GED_OBJECT, objectRelativePath: data.relativePath })}
              />
            )}
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
          <EnterpriseModalComponentContactsComponent
            enterprise={enterprise}
            defaultContactsSearch={defaultContactsSearch}
            onImportContactsClick={() => setModalData({ modal: EnterpriseModal.IMPORT_CONTACTS })}
            onCreateContactClick={() => setModalData({ modal: EnterpriseModal.CREATE_CONTACT })}
            onCreateContactBusinessClick={(contact) => setModalData({ modal: EnterpriseModal.CREATE_CONTACT_BUSINESS, contact })}
            onSendEmailToContactClick={(contact) => setModalData({ modal: EnterpriseModal.SEND_EMAIL_TO_CONTACT, contact })}
            onDeleteContactClick={(contact) => setModalData({ modal: EnterpriseModal.DELETE_CONTACT, contact })}
            onUpdateContactClick={(contact) => setModalData({ modal: EnterpriseModal.UPDATE_CONTACT, contact })}
            onUpdateContactPasswordClick={(contact) => setModalData({ modal: EnterpriseModal.UPDATE_CONTACT_PASSWORD, contact })}
            onContactEmailHistoryClick={(contact) => setModalData({ modal: EnterpriseModal.CONTACT_EMAIL_HISTORY, contact })}
          />
          <EnterpriseModalComponentLifesheetComponent enterprise={enterprise} onCreateClick={() => setModalData({ modal: EnterpriseModal.CREATE_LIFESHEET })} />
          <EnterpriseModalComponentWorkloadsComponent
            enterprise={enterprise}
            onEmailClick={(data) => setModalData({ modal: EnterpriseModal.EMAIL, emailId: data.mailId! })}
            onUnlinkClick={(data) => setModalData({ modal: EnterpriseModal.UNLINK_TASK, taskId: data.id })}
          />
        </div>
      </div>
      <Suspense fallback={<LoaderModal />}>{modal}</Suspense>
      {/* <Outlet /> */}
    </ReactModal>
  );
}
