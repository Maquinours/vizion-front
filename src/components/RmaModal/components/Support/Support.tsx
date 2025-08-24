import { useMemo, useState } from 'react';
import AssistanceState from '../../../../utils/enums/AssistanceState';
import CategoryBusiness from '../../../../utils/enums/CategoryBusiness';
import AssistanceResponseDto from '../../../../utils/types/AssistanceResponseDto';
import { useAuthentifiedUserQuery } from '../../../../views/App/utils/functions/getAuthentifiedUser';
import BusinessRmaLinksComponent from '../../../BusinessRmaLinks/BusinessRmaLinks';
import styles from './Support.module.scss';
import RmaModalComponentSupportComponentGedComponent from './components/Ged/Ged';
import RmaModalComponentSupportComponentHeaderComponent from './components/Header/Header';
import RmaModalComponentSupportComponentLifesheetComponent from './components/Lifesheet/Lifesheet';
import RmaModalComponentSupportComponentReturnAddressComponent from './components/ReturnAddress/ReturnAddress';
import RmaModalComponentSupportComponentTableComponent from './components/Table/Table';
import RmaModalComponentSupportComponentTasksComponent from './components/Tasks/Tasks';
import RmaModalComponentSupportComponentCreateDetailModalView from './components/CreateDetailModal/CreateDetailModal';
import RmaModalComponentSupportComponentPdfModalView from './components/PdfModal/PdfModal';
import CreateLifesheetModalComponent from '../../../CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import RenameGedObjectModalComponent from '../../../RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../utils/enums/FileType';
import CreateGedDirectoryModalComponent from '../../../CreateGedDirectoryModal/CreateGedDirectoryModal';
import ImportGedFilesModalComponent from '../../../ImportGedFilesModal/ImportGedFilesModal';
import DeleteGedObjectModalComponent from '../../../DeleteGedObjectModal/DeleteGedObjectModal';
import RmaModalComponentSupportoCmponentEmailModalComponent from './components/EmailModal/EmailModal';
import UnlinkWorkloadModalComponent from '../../../UnlinkWorkloadModal/UnlinkWorkloadModal';
import CreateBusinessRmaLinkModalComponent from '../../../CreateBusinessRmaLinkModal/CreateBusinessRmaLinkModal';
import DeleteBusinessRmaLinkModalComponent from '../../../DeleteBusinessRmaLinkModal/DeleteBusinessRmaLinkModal';
import LifeSheetResponseDto from '../../../../utils/types/LifeSheetResponseDto';
import { DeleteLifesheetModalComponent } from '../../../DeleteLifesheetModal/DeleteLifesheetModal';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

enum ModalType {
  CREATE_DETAIL,
  PDF,
  CREATE_LIFESHEET,
  RENAME_GED_OBJECT,
  CREATE_GED_DIRECTORY,
  IMPORT_GED_FILES,
  DELETE_GED_OBJECT,
  EMAIL,
  UNLINK_TASK,
  CREATE_LINK,
  DELETE_LINK,
  DELETE_LIFESHEET,
}

type ModalData =
  | { modal: ModalType.CREATE_DETAIL }
  | { modal: ModalType.PDF }
  | { modal: ModalType.CREATE_LIFESHEET }
  | { modal: ModalType.RENAME_GED_OBJECT; objectRelativePath: string }
  | { modal: ModalType.CREATE_GED_DIRECTORY; directoryRelativePath: string }
  | { modal: ModalType.IMPORT_GED_FILES; directoryRelativePath: string }
  | { modal: ModalType.DELETE_GED_OBJECT; objectRelativePath: string }
  | {
      modal: ModalType.EMAIL;
      emailId: string;
    }
  | {
      modal: ModalType.UNLINK_TASK;
      taskId: string;
    }
  | {
      modal: ModalType.CREATE_LINK;
    }
  | {
      modal: ModalType.DELETE_LINK;
      associatedId: string;
    }
  | {
      modal: ModalType.DELETE_LIFESHEET;
      lifesheet: LifeSheetResponseDto;
    };

type RmaModalComponentSupportComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  navigateToNextStep: () => void;
}>;
export default function RmaModalComponentSupportComponent({ rma, navigateToNextStep }: RmaModalComponentSupportComponentProps) {
  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  // const { rmaId } = routeApi.useParams();
  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  // const getBusinessLinkItemLink = useCallback((_item: AllBusinessResponseDto): LinkOptions => {
  //   // switch (item.category) {
  //   //   case CategoryBusiness.AFFAIRE:
  //   //     return {
  //   //       to: '/app/businesses-rma/business/$businessId',
  //   //       params: { businessId: item.businessId },
  //   //     };
  //   //   case CategoryBusiness.RMA:
  //   //     return {
  //   //       to: '/app/businesses-rma/rma/$rmaId',
  //   //       params: { rmaId: item.businessId },
  //   //     };
  //   // }
  // }, []);

  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.CREATE_DETAIL:
        return <RmaModalComponentSupportComponentCreateDetailModalView rma={rma} onClose={() => setModalData(undefined)} />;
      case ModalType.PDF:
        return <RmaModalComponentSupportComponentPdfModalView rma={rma} onClose={() => setModalData(undefined)} />;
      case ModalType.CREATE_LIFESHEET:
        return (
          <CreateLifesheetModalComponent associatedItemType={LifesheetAssociatedItem.RMA} associatedItemId={rma.id} onClose={() => setModalData(undefined)} />
        );
      case ModalType.RENAME_GED_OBJECT:
        return (
          <RenameGedObjectModalComponent
            type={FileType.SAV}
            id={rma.id}
            objectRelativePath={modalData.objectRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.CREATE_GED_DIRECTORY:
        return (
          <CreateGedDirectoryModalComponent
            type={FileType.SAV}
            id={rma.id}
            directoryRelativePath={modalData.directoryRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.IMPORT_GED_FILES:
        return (
          <ImportGedFilesModalComponent
            type={FileType.SAV}
            id={rma.id}
            directoryRelativePath={modalData.directoryRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_GED_OBJECT:
        return (
          <DeleteGedObjectModalComponent
            type={FileType.SAV}
            id={rma.id}
            objectRelativePath={modalData.objectRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.EMAIL:
        return <RmaModalComponentSupportoCmponentEmailModalComponent emailId={modalData.emailId} onClose={() => setModalData(undefined)} />;
      case ModalType.UNLINK_TASK:
        return <UnlinkWorkloadModalComponent taskId={modalData.taskId} onClose={() => setModalData(undefined)} />;
      case ModalType.CREATE_LINK:
        return <CreateBusinessRmaLinkModalComponent category={CategoryBusiness.RMA} number={rma.number} onClose={() => setModalData(undefined)} />;
      case ModalType.DELETE_LINK:
        return (
          <DeleteBusinessRmaLinkModalComponent
            category={CategoryBusiness.RMA}
            number={rma.number}
            associatedId={modalData.associatedId}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_LIFESHEET:
        return <DeleteLifesheetModalComponent lifesheet={modalData.lifesheet} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData]);

  return (
    <>
      <div className={styles.container}>
        <RmaModalComponentSupportComponentHeaderComponent
          rma={rma}
          navigateToNextStep={navigateToNextStep}
          onCreateDetailClick={() => setModalData({ modal: ModalType.CREATE_DETAIL })}
          onEditClick={() => setModalData({ modal: ModalType.PDF })}
        />
        <div className={styles.grid}>
          <RmaModalComponentSupportComponentTableComponent rma={rma} />
          <RmaModalComponentSupportComponentReturnAddressComponent rma={rma} />
        </div>
        <div className={styles.second_grid}>
          <RmaModalComponentSupportComponentLifesheetComponent
            rma={rma}
            onCreateClick={() => setModalData({ modal: ModalType.CREATE_LIFESHEET })}
            onDeleteClick={(lifesheet) => setModalData({ modal: ModalType.DELETE_LIFESHEET, lifesheet })}
          />
          <RmaModalComponentSupportComponentGedComponent
            rma={rma}
            onCreateDirectoryClick={(data) => setModalData({ modal: ModalType.CREATE_GED_DIRECTORY, directoryRelativePath: data?.relativePath ?? '' })}
            onImportFilesClick={(data) => setModalData({ modal: ModalType.IMPORT_GED_FILES, directoryRelativePath: data?.relativePath ?? '' })}
            onRenameClick={(data) => setModalData({ modal: ModalType.RENAME_GED_OBJECT, objectRelativePath: data.relativePath })}
            onDeleteClick={(data) => setModalData({ modal: ModalType.DELETE_GED_OBJECT, objectRelativePath: data.relativePath })}
          />
          {authentifiedUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
            <RmaModalComponentSupportComponentTasksComponent
              rma={rma}
              onEmailClick={(data) => setModalData({ modal: ModalType.EMAIL, emailId: data.mailId! })}
              onUnlinkClick={(data) => setModalData({ modal: ModalType.UNLINK_TASK, taskId: data.id })}
            />
          )}
          <BusinessRmaLinksComponent
            category={CategoryBusiness.RMA}
            number={rma.number}
            // getItemLink={getBusinessLinkItemLink}
            onItemClick={() => {}}
            canCreate={rma.state !== AssistanceState.ARCHIVE}
            onCreateClick={() => setModalData({ modal: ModalType.CREATE_LINK })}
            // createLink={{ to: '/app/businesses-rma/rma/$rmaId/support/create-link', search: true, replace: true, resetScroll: false, preload: 'intent' }}
            onDeleteClick={() => setModalData({ modal: ModalType.DELETE_LINK, associatedId: rma.id })}
            // getDeleteLink={(data) => ({
            //   to: '/app/businesses-rma/rma/$rmaId/support/delete-link/$associatedId',
            //   params: { associatedId: data.id },
            //   search: true,
            //   replace: true,
            //   resetScroll: false,
            //   preload: 'intent',
            // })}
          />
        </div>
      </div>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
