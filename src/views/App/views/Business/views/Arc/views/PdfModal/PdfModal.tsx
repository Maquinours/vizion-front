import ReactModal from 'react-modal';
import styles from './PdfModal.module.scss';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import AppViewBusinessViewArcViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc/pdf');

export default function AppViewBusinessViewArcViewPdfModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { hideReferencesPrices } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false, ignoreBlocker: true });
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
            <Link
              from={routeApi.id}
              to="send-by-email"
              search={(old) => old}
              replace
              resetScroll={false}
              preload="intent"
              ignoreBlocker
              className="btn btn-secondary"
            >
              Envoyer par mail
            </Link>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
