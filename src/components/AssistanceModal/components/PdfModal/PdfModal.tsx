import { pdf, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { formatFileName } from '../../../../utils/functions/files';
import TechnicalSupportResponseDto from '../../../../utils/types/TechnicalSupportResponseDto';
import LoaderModal from '../../../LoaderModal/LoaderModal';
import SendEmailModalComponent from '../../../SendEmailModal/SendEmailModal';
import AppViewAssistanceViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import styles from './PdfModal.module.scss';

enum ModalType {
  LOADING,
  SEND_BY_EMAIL,
}

type ModalData = { modal: ModalType.LOADING } | { modal: ModalType.SEND_BY_EMAIL; file: File };

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/pdf');
// const routePath = '/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf';

type AssistanceModalComponentPdfModalComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
  onClose: () => void;
}>;
export default function AssistanceModalComponentPdfModalComponent({ assistance, onClose }: AssistanceModalComponentPdfModalComponentProps) {
  // const navigate = routeApi.useNavigate();

  // const { assistanceId } = routeApi.useParams();

  // const { data: assistance } = useSuspenseQuery(queries['technical-supports'].detail._ctx.byId(assistanceId));

  // const onClose = () => {
  //   navigate({ to: '..', search: true, replace: true, resetScroll: false });
  // };

  const [modalData, setModalData] = useState<ModalData | undefined>(undefined);

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.LOADING:
        return <LoaderModal />;
      case ModalType.SEND_BY_EMAIL:
        return (
          <SendEmailModalComponent
            isOpen={true}
            onClose={() => setModalData(undefined)}
            defaultSubject={`Assistance ${assistance.businessNumber}`}
            defaultAttachments={[modalData.file]}
          />
        );
    }
  }, [modalData, assistance]);

  const onSendByEmailButtonClick = async () => {
    setModalData({ modal: ModalType.LOADING });

    const blob = await pdf(<AppViewAssistanceViewPdfModalViewPdfComponent assistance={assistance} />).toBlob();
    const file = new File([blob], formatFileName(`Assistance ${assistance.businessNumber}.pdf`), {
      type: blob.type,
    });

    setModalData({ modal: ModalType.SEND_BY_EMAIL, file });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre AT :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewAssistanceViewPdfModalViewPdfComponent assistance={assistance} />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={() => onClose()}>
              Modifier
            </button>
            <PDFDownloadLink
              document={<AppViewAssistanceViewPdfModalViewPdfComponent assistance={assistance} />}
              fileName={`Assistance -` + assistance.businessNumber + '.pdf'}
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            <button type="button" className="btn btn-secondary" onClick={onSendByEmailButtonClick}>
              {/* <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" className="btn btn-secondary"> */}
              Envoyer par mail
              {/* </Link> */}
            </button>
          </div>
        </div>
      </ReactModal>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
