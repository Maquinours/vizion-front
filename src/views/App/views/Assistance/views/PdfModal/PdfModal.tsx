import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './PdfModal.module.scss';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import AppViewAssistanceViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf');

export default function AppViewAssistanceViewPdfModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { assistanceId } = routeApi.useParams();

  const { data: assistance } = useSuspenseQuery(queries['technical-supports'].detail._ctx.byId(assistanceId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
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
            <Link from={routeApi.id} to="send-by-email" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
              Envoyer par mail
            </Link>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
