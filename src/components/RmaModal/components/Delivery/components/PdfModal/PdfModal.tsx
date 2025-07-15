import { pdf, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { formatFileName } from '../../../../../../utils/functions/files';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import AppViewRmaViewDeliveryViewPdfModalViewPdfComponent from '../../../../../../views/App/views/Rma/views/Delivery/views/PdfModal/components/Pdf/Pdf';
import LoaderModal from '../../../../../LoaderModal/LoaderModal';
import SendEmailModalComponent from '../../../../../SendEmailModal/SendEmailModal';
import styles from './PdfModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery/pdf');

enum ModalType {
  LOADING,
  SEND_BY_EMAIL,
}

type ModalData = { modal: ModalType.LOADING } | { modal: ModalType.SEND_BY_EMAIL; file: File };

type RmaModalComponentDeliveryComponentPdfModalComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onClose: () => void;
}>;
export default function RmaModalComponentDeliveryComponentPdfModalComponent({ rma, onClose }: RmaModalComponentDeliveryComponentPdfModalComponentProps) {
  //   const navigate = routeApi.useNavigate();

  //   const { rmaId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  //   const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  //   const onClose = () => {
  //     navigate({ to: '..', search: true, replace: true, resetScroll: false });
  //   };

  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.LOADING:
        return <LoaderModal />;
      case ModalType.SEND_BY_EMAIL:
        return (
          <SendEmailModalComponent
            isOpen
            onClose={() => setModalData(undefined)}
            defaultRecipient={rma.addressEmail ? [rma.addressEmail] : undefined}
            defaultSubject={`RMA / Solution ${rma.number}`}
            defaultAttachments={[modalData.file]}
            lifeSheetInfoDto={{
              rmaNumber: rma.number,
              rmaId: rma.id,
            }}
          />
        );
    }
  }, [modalData, rma]);

  const onSendByEmailClick = async () => {
    setModalData({ modal: ModalType.LOADING });
    const blob = await pdf(<AppViewRmaViewDeliveryViewPdfModalViewPdfComponent rma={rma} />).toBlob();
    const file = new File([blob], formatFileName(`RMA_${rma.number}.pdf`), {
      type: blob.type,
    });
    setModalData({ modal: ModalType.SEND_BY_EMAIL, file });
  };

  return (
    <>
      <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre RMA :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewRmaViewDeliveryViewPdfModalViewPdfComponent rma={rma} />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={() => onClose()}>
              Modifier
            </button>
            <PDFDownloadLink document={<AppViewRmaViewDeliveryViewPdfModalViewPdfComponent rma={rma} />} fileName={`RMA_${rma.number}.pdf`}>
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <button type="button" className="btn btn-secondary" onClick={onSendByEmailClick}>
                Envoyer par mail
              </button>
              //   <Link
              //     from="/app/businesses-rma/rma/$rmaId/delivery/pdf"
              //     to="send-by-email"
              //     search
              //     replace
              //     resetScroll={false}
              //     preload="intent"
              //     className="btn btn-secondary"
              //   >
              //     Envoyer par mail
              //   </Link>
            )}
          </div>
        </div>
      </ReactModal>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
