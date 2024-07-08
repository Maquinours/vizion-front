import { useContext } from 'react';
import ReactModal from 'react-modal';
import ExpertStudyContext from '../../../../../../utils/context';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent from './components/Pdf/Pdf';
import { getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentProps = Readonly<{ images: Array<Blob> }>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponent({
  images,
}: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentProps) {
  const { setModal } = useContext(ExpertStudyContext)!;

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    setModal(undefined);
  };

  const fileName = `${business.numBusiness.replace(' ', '')}-${business.title ?? ''}.pdf`;

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
    >
      <div className="w-full rounded-md bg-white pb-2">
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">FICHIER PDF</h2>
        <PDFViewer style={{ height: '85vh', width: '70vw' }}>
          <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent images={images} />
        </PDFViewer>
        <div className="mt-6 flex items-center justify-center space-x-2">
          <button onClick={onClose} className="btn btn-secondary">
            Annuler
          </button>
          <PDFDownloadLink
            fileName={fileName}
            document={<AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent images={images} />}
          >
            {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
          </PDFDownloadLink>

          {/* <BlobProvider // TODO: reimplement this
            document={
              <PdfModalBody
                pdfFileData={pdfFileData}
                currentBusiness={currentBusiness}
                cams={cams}
                hddValue={hddValue}
                showDensityImages={showDensityImages}
                hddCalcComment={hddCalcComment}
              />
            }
          >
            {({ blob, loading }) => {
              return (
                <>
                  {loading ? (
                    <button className="btn btn-secondary">...</button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => sendByMail(blob)}>
                      Envoyer par mail
                    </button>
                  )}
                </>
              );
            }}
          </BlobProvider> */}
        </div>
      </div>
    </ReactModal>
  );
}
