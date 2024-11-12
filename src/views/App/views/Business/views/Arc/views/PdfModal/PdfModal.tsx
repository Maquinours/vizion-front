import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AppViewBusinessViewArcViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import styles from './PdfModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc/pdf');
const routePath = '/app/businesses-rma/business/$businessId/arc/pdf';

export default function AppViewBusinessViewArcViewPdfModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();
  const { hideReferencesPrices } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre ARC :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewBusinessViewArcViewPdfModalViewPdfComponent business={business} arc={arc} hideReferencesPrices={hideReferencesPrices} />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={onClose}>
              Modifier
            </button>
            <PDFDownloadLink
              document={<AppViewBusinessViewArcViewPdfModalViewPdfComponent business={business} arc={arc} hideReferencesPrices={hideReferencesPrices} />}
              fileName={`ARC-` + arc.number + '.pdf'}
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-secondary">
              Envoyer par mail
            </Link>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
