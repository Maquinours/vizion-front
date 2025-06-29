import { BlobProvider, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { groupBy } from 'lodash';
import { useContext, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { useShallow } from 'zustand/react/shallow';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { formatFileName } from '../../../../../../../../../../../../utils/functions/files';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import ExpertStudyContext from '../../../../../../utils/context';
import { ExpertStudyRecorderNode } from '../../../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudySynopticCameraNode } from '../../../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import useStore, { RFState } from '../../../../../Flow/utils/store';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent from './components/Pdf/Pdf';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentSendByEmailModalView from './components/SendByEmailModal/SendByEmailModal';
import { ExpertStudyDensityCameraNode } from '../../../../../Flow/components/DensityCameraNode/DensityCameraNode';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const selector = (state: RFState) => ({
  pages: state.pages,
  showDensityImages: !state.pages.some((page) => page.type === 'density'),
  hddCalculationHoursPerDay: state.hddCalculationData.hoursPerDay,
});

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentProps = Readonly<{ images: Array<Blob> }>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponent({
  images,
}: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentProps) {
  const { pages, showDensityImages, hddCalculationHoursPerDay } = useStore(useShallow(selector));

  const { setModal } = useContext(ExpertStudyContext)!;

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: products } = useSuspenseQuery({ ...queries.product.list, staleTime: Infinity });

  const [sendByEmailFile, setSendByEmailFile] = useState<File>();

  const { cams, recorders } = useMemo(() => {
    return {
      cams: Object.entries(
        groupBy(
          pages
            .filter((page) => page.type === 'synoptic')
            .reduce(
              (acc: Array<ExpertStudySynopticCameraNode>, page) =>
                acc.concat(page.nodes.filter((node): node is ExpertStudySynopticCameraNode => node.type === 'synopticCamera')),
              [],
            ),
          'data.productId',
        ),
      ).map(([key, value]) => ({ id: key, quantity: value.reduce((acc, node) => acc + (node.data.quantity ?? 1), 0) })),
      recorders: pages
        .filter((page) => page.type === 'synoptic')
        .reduce(
          (acc: Array<{ productId: string; quantity: number; options: Array<{ id: string; quantity: number }> }>, page) =>
            acc.concat(
              page.nodes
                .filter((node): node is ExpertStudyRecorderNode => node.type === 'recorder')
                .map((node) => ({ productId: node.data.productId, quantity: node.data.quantity ?? 1, options: node.data.options })),
            ),
          [],
        ),
    };
  }, [pages]);

  const { cameras, hddSpace, hddCalculationDays } = useMemo(() => {
    const cameras = cams
      .map((cam) => {
        const product = products.find((product) => product.id === cam.id);
        if (!product) return undefined;
        return { product, quantity: cam.quantity };
      })
      .filter((product): product is { product: ProductResponseDto; quantity: number } => !!product);

    const flux = cameras.reduce((acc, camera) => {
      const flux1 = camera.product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX1')?.value ?? 0;
      const flux2 = camera.product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX2')?.value ?? 0;
      return acc + (flux1 + flux2) * camera.quantity;
    }, 0);

    const hddSpace = recorders.reduce((acc, recorder) => {
      const product = products.find((product) => product.id === recorder.productId);
      const capacity =
        ((product?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value ?? 0) +
          recorder.options.reduce((acc, option) => {
            const capacity =
              (products.find((product) => product.id === option.id)?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value ??
                0) * option.quantity;

            return acc + capacity;
          }, 0)) *
        recorder.quantity;
      return acc + capacity;
    }, 0);

    const hddCalculationDays =
      (1024 * hddSpace) /
      (((flux / // Kbps
        8) * // KBps
        3600) / // KB per hour
        1024 / // MB per hour
        1024) / // GB per hour
      hddCalculationHoursPerDay;

    return { cameras, hddSpace, hddCalculationDays };
  }, [cams, recorders, products]);

  const densityStats = useMemo(() => {
    return pages
      .filter((page) => page.type === 'density')
      .map((page, index) => {
        const items = page.nodes
          .filter((node): node is ExpertStudyDensityCameraNode => node.type === 'densityCamera')
          .map((node) => {
            const product = products?.find((product) => product.id === node.data.productId);
            if (!product) return;
            const camSpecs = (() => {
              const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
              const recognition = product.specificationProducts?.find((spec) => spec.specification?.name === 'RECONNAISSANCE');
              const reading = product.specificationProducts?.find((spec) => spec.specification?.name === 'LECTURE DE PLAQUE');
              const identification = product.specificationProducts?.find((spec) => spec.specification?.name === 'IDENTIFICATION');
              return {
                hAngle: { value: hAngle?.value ?? 0, min: hAngle?.minValue ?? 0, max: hAngle?.maxValue ?? 0 },
                recognition: { value: recognition?.value ?? 0, min: recognition?.minValue ?? 0, max: recognition?.maxValue ?? 0 },
                reading: { value: reading?.value ?? 0, min: reading?.minValue ?? 0, max: reading?.maxValue ?? 0 },
                identification: { value: identification?.value ?? 0, min: identification?.minValue ?? 0, max: identification?.maxValue ?? 0 },
              };
            })();
            const computedData = (['recognition', 'reading', 'identification'] as Array<'recognition' | 'reading' | 'identification'>).reduce(
              (acc, type) => {
                if (camSpecs.hAngle.value) acc[type] = camSpecs[type].value;
                else {
                  const m = (camSpecs[type].max - camSpecs[type].min) / (camSpecs.hAngle.min - camSpecs.hAngle.max);
                  const b = camSpecs[type].max - m * camSpecs.hAngle.min;
                  acc[type] = m * node.data.angle + b;
                }
                return acc;
              },
              { recognition: NaN, reading: NaN, identification: NaN },
            );
            return {
              recognition: computedData.recognition,
              reading: computedData.reading,
              identification: computedData.identification,
              name: node.data.name,
              reference: product.reference,
              angle: node.data.angle,
            };
          })
          .filter(
            (item): item is { name: string; reference: string; identification: number; reading: number; recognition: number; angle: number } =>
              item !== undefined,
          );
        return { page: { name: page.name ?? `Page ${index + 1}`, id: page.id }, items };
      });
  }, [pages, products]);

  const onClose = () => {
    setModal(undefined);
  };

  const fileName = formatFileName(`${business.numBusiness.replace(' ', '')}-${business.title ?? ''}.pdf`);

  return (
    <>
      <ReactModal
        isOpen={true}
        onRequestClose={onClose}
        className="absolute top-2/4 left-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
        overlayClassName="Overlay"
      >
        <div className="w-full rounded-md bg-white pb-2">
          <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">FICHIER PDF</h2>
          <PDFViewer style={{ height: '85vh', width: '70vw' }}>
            <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent
              images={images}
              cameras={cameras}
              hddSpace={hddSpace}
              hddCalculationDays={hddCalculationDays}
              business={business}
              showDensityImages={showDensityImages}
              hddCalculationHoursPerDay={hddCalculationHoursPerDay}
              densityStats={densityStats}
            />
          </PDFViewer>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <PDFDownloadLink
              fileName={fileName}
              document={
                <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent
                  images={images}
                  cameras={cameras}
                  hddSpace={hddSpace}
                  hddCalculationDays={hddCalculationDays}
                  business={business}
                  showDensityImages={showDensityImages}
                  hddCalculationHoursPerDay={hddCalculationHoursPerDay}
                  densityStats={densityStats}
                />
              }
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>

            <BlobProvider
              document={
                <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent
                  images={images}
                  cameras={cameras}
                  hddSpace={hddSpace}
                  hddCalculationDays={hddCalculationDays}
                  business={business}
                  showDensityImages={showDensityImages}
                  hddCalculationHoursPerDay={hddCalculationHoursPerDay}
                  densityStats={densityStats}
                />
              }
            >
              {({ blob, loading }) =>
                loading ? (
                  <button className="btn btn-secondary">Chargement...</button>
                ) : (
                  !!blob && (
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setSendByEmailFile(
                          new File([blob], fileName, {
                            type: blob.type,
                          }),
                        )
                      }
                    >
                      Envoyer par mail
                    </button>
                  )
                )
              }
            </BlobProvider>
          </div>
        </div>
      </ReactModal>
      {!!sendByEmailFile && (
        <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentSendByEmailModalView
          file={sendByEmailFile}
          onClose={() => setSendByEmailFile(undefined)}
        />
      )}
    </>
  );
}
