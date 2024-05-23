import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './CreditsModal.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../../../utils/enums/BillType';
import { useMemo } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import AppViewBusinessViewBillViewCreditsModalViewPdfComponent from './components/Pdf/Pdf';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bill/credits');

export default function AppViewBusinessViewBillViewCreditsModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { page } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: enterprise } = useSuspenseQuery(queries.enterprise.detail(business.enterpriseId));
  const { data: credits } = useSuspenseQuery({
    ...queries['business-bills'].list._ctx.byBusinessId(businessId),
    select: (data) => data.filter((d) => d.type === BillType.AVOIR),
  });

  const credit = useMemo(() => credits.at(page), [credits, page]);

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, page: undefined }), replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Avoir</h6>
        </div>
        {credit && (
          <div className={styles.modal_pdfviewer}>
            <div className={styles.pdf_container}>
              <div className={styles.title}>{credit.number}</div>

              <div className={styles.pdf_viewer}>
                <PDFViewer showToolbar={false}>
                  <AppViewBusinessViewBillViewCreditsModalViewPdfComponent credit={credit} business={business} enterprise={enterprise} />
                </PDFViewer>
              </div>
              <div className={styles.buttons_container}>
                <PDFDownloadLink
                  document={<AppViewBusinessViewBillViewCreditsModalViewPdfComponent credit={credit} business={business} enterprise={enterprise} />}
                  fileName={`Avoir-` + credit.number + '.pdf'}
                >
                  {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
                </PDFDownloadLink>
                {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                  <Link from={routeApi.id} to="send-by-email" search={(old) => old} replace resetScroll={false} className="btn btn-secondary">
                    Envoyer par mail
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={styles.pagination_container}>
          <PaginationComponent page={page} totalPages={credits.length} pageLink={(page) => ({ search: (old) => ({ ...old, page }) })} />
        </div>

        <div className={styles.modal_footer}>
          <button className="btn btn-primary" onClick={() => onClose()}>
            Fermer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
