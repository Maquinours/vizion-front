import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './CommercialNoticeModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/commercial-notice');

export default function AppViewBusinessViewQuotationViewCommercialNoticeModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: references } = useSuspenseQuery({
    ...queries['business-quotations'].detail._ctx.byBusinessId(business.id),
    select: (data) =>
      (data.subQuotationList
        ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
        ?.filter((reference) => reference !== null) ?? []) as string[],
  });
  const { data: commercialNoticeUrl } = useSuspenseQuery({
    ...queries['commercial-notices'].data._ctx.byProductReferences(references),
    select: (data) => `data:application/pdf;base64,${data}`,
    staleTime: Infinity,
  });

  const getFilePluginInstance = getFilePlugin({ fileNameGenerator: () => `Notice_Commerciale_${business.numBusiness.replace(/\s|-/g, '_')}.pdf` });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  return (
    <ReactModal isOpen={true} overlayClassName="Overlay" onRequestClose={onClose} className={styles.modal}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Notice commerciale :</h6>
        </div>
        <div className={styles.modal_pdfviewer}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={commercialNoticeUrl} defaultScale={SpecialZoomLevel.PageFit} plugins={[getFilePluginInstance]} />
          </Worker>
        </div>
        <div className={styles.modal_footer}>
          <button className="btn btn-primary" onClick={onClose}>
            Fermer
          </button>
          <div>
            <getFilePluginInstance.Download>
              {({ onClick }) => (
                <button className="btn btn-secondary" onClick={onClick}>
                  Télécharger
                </button>
              )}
            </getFilePluginInstance.Download>
            <Link from={routeApi.id} to="send-by-email" search={(old) => old} className="btn btn-secondary ml-2">
              Envoyer par mail
            </Link>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
