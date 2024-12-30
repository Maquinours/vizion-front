import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { ReactFlowState, useStore, InternalNode } from '@xyflow/react';
import { toBlob } from 'html-to-image';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import LoaderModal from '../../../../../../../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { AutomaticStudyFinalCameraNode } from '../../../../../Flow/components/FinalCameraNode/FinalCameraNode';
import AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentPdfComponent from './components/Pdf/Pdf';
import { AutomaticStudyNvrNode } from '../../../../../Flow/components/NvrNode/NvrNode';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/automatic');

const getCameraProducts = (state: ReactFlowState, products: Array<ProductResponseDto>) => {
  const nodes = Array.from(state.nodeLookup.values());

  const camNodes = nodes.filter((node): node is InternalNode<AutomaticStudyFinalCameraNode> => node.type === 'finalNode');

  const result: Array<{ quantity: number; product: ProductResponseDto }> = [];

  for (const camNode of camNodes) {
    const item = result.find((item) => item.product.reference === camNode.data.model.reference);
    if (item) item.quantity++;
    else {
      const product = products.find((product) => product.reference === camNode.data.model.reference);
      if (product)
        result.push({
          quantity: 1,
          product,
        });
    }
  }

  return result;
};

const getNvrCapacity = (state: ReactFlowState, products: Array<ProductResponseDto>) => {
  const nodes = Array.from(state.nodeLookup.values());
  const nvrNode = nodes.find((node): node is InternalNode<AutomaticStudyNvrNode> => node.type === 'nvrNode');
  const nvr = products.find((product) => product.reference === nvrNode?.data.reference);
  const capacity = nvr?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value;

  return capacity;
};

type AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponent({
  onClose,
}: AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentProps) {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: products } = useSuspenseQuery({ ...queries.product.list, staleTime: Infinity });

  const cameras = useStore(
    (state) => getCameraProducts(state, products),
    (a, b) => _.isEqual(a, b),
  );
  const nvrCapacity = useStore((state) => getNvrCapacity(state, products));

  const [synopticImage, setSynopticImage] = useState<Blob>();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      toBlob(document.querySelector('.react-flow') as HTMLElement, {
        filter: (node) => !node.classList?.contains('react-flow__controls'), // We don't want to take the controls into account
        width: 1096,
        height: 768,
      }),
    onSuccess: (data) => {
      setSynopticImage(data!);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la génération de l'image du synoptique");
      onClose();
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  const hddResult = useMemo(() => {
    if (!nvrCapacity) return 0;

    const flux =
      (cameras?.reduce((acc, cam) => {
        const flux1 = cam.product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX1')?.value;
        const flux2 = cam.product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX2')?.value;
        if (!flux1 || !flux2) return acc;

        return acc + (flux1 + flux2) * cam.quantity;
      }, 0) / // Kbps
        8 / // KBps
        1024 / // MBps
        1024 / // GBps
        1024) * // TBps
      86400; // TB per day; // KBps

    return nvrCapacity / flux;
  }, [cameras, nvrCapacity]);

  if (isPending) return <LoaderModal />;

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-[2005] m-auto h-auto -translate-x-2/4 -translate-y-2/4 rounded-[5px] bg-[#fbfcfe] p-0 opacity-100 shadow-[0px_3px_5px_#10173526]"
      overlayClassName="Overlay"
    >
      <div className="relative mx-auto flex h-fit w-fit flex-col space-y-4 rounded-md border-2 border-t-0 border-[#31385a] bg-slate-50 px-7 py-0 pb-4 text-[#31385a]">
        <div className="absolute inset-x-0 mt-0 flex h-12 border-collapse items-center justify-center rounded-t-md border-t border-t-[#31385a] bg-[#31385a] text-center text-white">
          Fichier PDF
        </div>
        <div className="h-6" />
        <div>
          <PDFViewer className="h-[80vh] w-[70vw]">
            <AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentPdfComponent
              business={business}
              cameras={cameras}
              synopticImage={synopticImage!}
              hddResult={hddResult}
              nvrCapacity={nvrCapacity}
            />
          </PDFViewer>
        </div>
        <div className="flex items-center justify-center space-x-4 text-white">
          <PDFDownloadLink
            document={
              <AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentPdfComponent
                business={business}
                cameras={cameras}
                synopticImage={synopticImage!}
                hddResult={hddResult}
                nvrCapacity={nvrCapacity}
              />
            }
            fileName={`Etude VIZEO référence ${business.numBusiness}.pdf`}
          >
            {/* @ts-expect-error: library type mismatch */}
            {({ loading }) => (
              <button type="button" className="btn btn-primary">
                {loading ? 'Chargement...' : 'Télécharger'}
              </button>
            )}
          </PDFDownloadLink>
          <button type="button" className="btn btn-secondary" onClick={() => onClose()}>
            Fermer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
