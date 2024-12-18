import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import AppViewRmaViewReceptionViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import styles from './PdfModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/reception/pdf');

export default function AppViewRmaViewReceptionViewPdfModalView() {
  const navigate = routeApi.useNavigate();

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
              {/* @ts-expect-error: library type mismatch */}
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            {authentifiedUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <Link
                from="/app/businesses-rma/rma/$rmaId/reception/pdf"
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
