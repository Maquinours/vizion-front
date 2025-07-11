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

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

enum ModalType {
  CREATE_DETAIL,
  PDF,
}

type ModalData = { modal: ModalType.CREATE_DETAIL } | { modal: ModalType.PDF };

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
          <RmaModalComponentSupportComponentLifesheetComponent rma={rma} onCreateClick={() => {}} />
          <RmaModalComponentSupportComponentGedComponent
            rma={rma}
            onCreateDirectoryClick={() => {}}
            onImportFilesClick={() => {}}
            onRenameClick={() => {}}
            onDeleteClick={() => {}}
          />
          {authentifiedUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
            <RmaModalComponentSupportComponentTasksComponent rma={rma} onEmailClick={() => {}} onUnlinkClick={() => {}} />
          )}
          <BusinessRmaLinksComponent
            category={CategoryBusiness.RMA}
            number={rma.number}
            // getItemLink={getBusinessLinkItemLink}
            onItemClick={() => {}}
            canCreate={rma.state !== AssistanceState.ARCHIVE}
            onCreateClick={() => {}}
            // createLink={{ to: '/app/businesses-rma/rma/$rmaId/support/create-link', search: true, replace: true, resetScroll: false, preload: 'intent' }}
            onDeleteClick={() => {}}
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
