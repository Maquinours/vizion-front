import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ReactModal from 'react-modal';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from './components/Pdf/Pdf';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import styles from './PdfModal.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/pdf');

export default function AppViewBusinessViewQuotationViewPdfModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { hideAddresses, hideReferences, hidePrices, hideTotal } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
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
              <Link from={routeApi.id} to="send-by-email" search={(old) => old} replace resetScroll={false} preload="intent" className="btn btn-secondary">
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
