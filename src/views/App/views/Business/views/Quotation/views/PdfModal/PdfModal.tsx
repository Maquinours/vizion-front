import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import styles from './PdfModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/pdf');
const routePath = '/app/businesses-rma/business/$businessId/quotation/pdf';

export default function AppViewBusinessViewQuotationViewPdfModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();
  const { hideAddresses, hideReferences, hidePrices, hideTotal } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre devis :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
                business={business}
                quotation={quotation}
                hideAddresses={hideAddresses}
                hideReferences={hideReferences}
                hidePrices={hidePrices}
                hideTotal={hideTotal}
              />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={onClose}>
              Modifier
            </button>
            <PDFDownloadLink
              document={
                <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
                  business={business}
                  quotation={quotation}
                  hideAddresses={hideAddresses}
                  hideReferences={hideReferences}
                  hidePrices={hidePrices}
                  hideTotal={hideTotal}
                />
              }
              fileName={`Devis-` + quotation.number + '.pdf'}
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-secondary">
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
