import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './PdfModal.module.scss';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import AppViewRmaViewReceptionViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/reception/pdf');

export default function AppViewRmaViewReceptionViewPdfModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId } = routeApi.useParams();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre RMA :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewRmaViewReceptionViewPdfModalViewPdfComponent rma={rma} />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={() => onClose()}>
              Modifier
            </button>
            <PDFDownloadLink document={<AppViewRmaViewReceptionViewPdfModalViewPdfComponent rma={rma} />} fileName={`RMA_${rma.number}.pdf`}>
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            {authentifiedUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <Link from={routeApi.id} to="send-by-email" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
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
