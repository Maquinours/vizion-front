import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './PdfModal.module.scss';
import AppViewRmaViewDeliveryViewPdfModalViewPdfComponent from './components/Pdf/Pdf';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery/pdf');

export default function AppViewRmaViewDeliveryViewPdfModalView() {
  const navigate = routeApi.useNavigate();

  const { rmaId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
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
              <Link
                from="/app/businesses-rma/rma/$rmaId/delivery/pdf"
                to="send-by-email"
                search
                replace
                resetScroll={false}
                preload="intent"
                className="btn btn-secondary"
              >
                Envoyer par mail
              </Link>
            )}
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
