import { pdf } from '@react-pdf/renderer';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useNodesInitialized } from '@xyflow/react';
import { toBlob } from 'html-to-image';
import { groupBy, uniq } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import LoaderModal from '../../../../../../../../../../../../components/LoaderModal/LoaderModal';
import { saveSynopticBusiness } from '../../../../../../../../../../../../utils/api/synoptic';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { synopticBusinessQueryKeys } from '../../../../../../../../../../../../utils/constants/queryKeys/synoptic';
import { formatFileName } from '../../../../../../../../../../../../utils/functions/files';
import EnterpriseResponseDto from '../../../../../../../../../../../../utils/types/EnterpriseResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { SynopticRequestBusinessQuotationRequestSubQuotationRequestDto } from '../../../../../../../../../../../../utils/types/SynopticRequestDto';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from '../../../../../../../../../Business/views/Quotation/views/PdfModal/components/Pdf/Pdf';
import { ExpertStudyMiscProductNode } from '../../../../../Flow/components/MiscProductNode/MiscProductNode';
import { ExpertStudyMonitorNode } from '../../../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudySynopticCameraNode } from '../../../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTransmitterNode } from '../../../../../Flow/components/TransmitterNode/TransmitterNode';
import useStore, { RFState } from '../../../../../Flow/utils/store';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent from '../../../PdfModal/components/ShowStep/components/Pdf/Pdf';
import PDFMerger from 'pdf-merger-js';
import { ExpertStudyDensityCameraNode } from '../../../../../Flow/components/DensityCameraNode/DensityCameraNode';

type ProductNode = ExpertStudySynopticCameraNode | ExpertStudyMonitorNode | ExpertStudyRecorderNode | ExpertStudyTransmitterNode | ExpertStudyMiscProductNode;

const GROUPS = [
  {
    name: 'Caméras',
    categories: ['Caméra interieure', 'Caméra exterieure', 'Caméra universelle', 'Dôme motorisé', 'Autres cameras'],
  },
  { name: 'NVR', categories: ['Transmission', 'NVR'] },
  { name: 'Affichage', categories: ['Moniteur'] },
];

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  getPages: state.getPages,
  setCurrentPage: state.setCurrentPage,
  getHddCalculationHoursPerDay: state.getHddCalculationHoursPerDay,
  getHddCalculationData: state.getHddCalculationData,
});

type AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponentProps = Readonly<{
  onClose: () => void;
  onGenerated: (data: { quotationPdf: File; studyPdf: File; commercialNoticePdf: File | null; representative: EnterpriseResponseDto | undefined }) => void;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponent({
  onClose,
  onGenerated,
}: AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponentProps) {
  const queryClient = useQueryClient();

  const { currentPage, getPages, setCurrentPage, getHddCalculationHoursPerDay, getHddCalculationData } = useStore(useShallow(selector));

  const nodesInitialized = useNodesInitialized();

  const data = useRef<Map<number, Blob>>(new Map());

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: products } = useSuspenseQuery(queries.product.list);

  const [studyPdf, setStudyPdf] = useState<File>();
  const [quotationPdf, setQuotationPdf] = useState<File>();
  const [representative, setRepresentative] = useState<EnterpriseResponseDto>();
  const [commercialNoticePdf, setCommercialNoticePdf] = useState<File | null>();
  const [finalStudyPdf, setFinalStudyPdf] = useState<File>();

  const { mutate: generateQuotationPdf } = useMutation({
    mutationFn: async () => {
      const quotation = await queryClient.fetchQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
      const blob = await pdf(
        <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
          business={business}
          quotation={quotation}
          hideAddresses={false}
          hideReferences={false}
          hidePrices={false}
          hideTotal={false}
        />,
      ).toBlob();
      return new File([blob], formatFileName(`Devis-${quotation.number}.pdf`), { type: blob.type });
    },
    onSuccess: (file) => {
      setQuotationPdf(file);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du PDF');
      onClose();
    },
  });

  const { mutate: fetchRepresentative, isPending: isFetchingRepresentative } = useMutation({
    mutationFn: async () => {
      if (!business.deliveryDepartmentCode) return;
      const department = await queryClient.ensureQueryData(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode));
      if (!department?.repEnterprise?.id) return;
      const representative = await queryClient.ensureQueryData(queries.enterprise.detail(department.repEnterprise.id));
      return representative;
    },
    onSuccess: (enterprise) => {
      setRepresentative(enterprise);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du PDF');
      onClose();
    },
  });

  const { mutate: generateCommercialNoticePdf } = useMutation({
    mutationFn: async () => {
      const quotation = await queryClient.fetchQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
      const products = uniq(
        quotation.subQuotationList
          ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
          ?.filter((reference): reference is string => !!reference) ?? [],
      );
      if (products.length === 0) return null;
      const data = await queryClient.ensureQueryData(queries['commercial-notices'].data._ctx.byProductReferences(products));
      const blob = await (await fetch(`data:application/pdf;base64,${data}`)).blob();
      const file = new File([blob], 'DOC_COMMERCIAL_VIZEO.pdf', { type: blob.type });
      return file;
    },
    onSuccess: (file) => {
      setCommercialNoticePdf(file);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du PDF');
      onClose();
    },
  });

  const { mutate: saveSynopticBusinessWithQuotation } = useMutation({
    mutationFn: async () => {
      const pages = getPages();
      const hddCalculationData = getHddCalculationData();

      const [products, business] = await Promise.all([
        queryClient.ensureQueryData(queries.product.list),
        queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)),
      ]);

      const synopticPages = pages.filter((page) => page.type === 'synoptic' && !page.nodes.some((node) => node.type === 'background'));
      const productNodes = synopticPages.flatMap((page) =>
        page.nodes.filter(
          (node): node is ProductNode => !!node.type && ['synopticCamera', 'monitor', 'recorder', 'transmitter', 'misc-product'].includes(node.type),
        ),
      );

      const productsData = productNodes
        .reduce((acc: Array<{ product: ProductResponseDto; quantity: number; groupName: string }>, node) => {
          const product = products.find((product) => product.id === node.data.productId);
          if (!product) return acc;
          const quantity = 'quantity' in node.data && node.data.quantity !== undefined ? node.data.quantity : 1;
          const data = acc.find((data) => data.product.id === node.data.productId && (!node.data.option || (node.data.option && data.groupName === 'Options')));
          const groupName =
            data?.groupName ??
            (node.data.option
              ? 'Options'
              : GROUPS.find((group) => !!product.category && group.categories.includes(product.category))?.name || product.category || 'Autres');
          if (data) data.quantity += quantity;
          else
            acc.push({
              product: product,
              quantity: quantity,
              groupName: groupName,
            });
          if ('options' in node.data)
            for (const option of node.data.options) {
              const data = acc.find((data) => data.product.id === option.id && data.groupName === groupName);
              if (data) data.quantity += option.quantity;
              else {
                const product = products.find((product) => product.id === option.id);
                if (product) acc.push({ product: product, quantity: option.quantity, groupName: groupName });
              }
            }
          return acc;
        }, [])
        .filter((data) => data.quantity > 0 || data.groupName === 'Options');

      const subQuotations: Array<SynopticRequestBusinessQuotationRequestSubQuotationRequestDto> = [
        { name: 'Default', orderNum: '0', quotationDetails: [] },
        ...Object.entries(groupBy(productsData, 'groupName'))
          .sort(([a], [b]) => {
            const aIndex = GROUPS.findIndex((group) => group.name === a);
            const bIndex = GROUPS.findIndex((group) => group.name === b);
            return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
          })
          .map(([groupName, products], index) => ({
            name: groupName,
            orderNum: `${index + 1}`,
            quotationDetails: products.map((product) => {
              const publicUnitPrice = product.product.publicPrice ?? 0;
              const unitPrice = Number((publicUnitPrice - publicUnitPrice * ((business.reduction ?? 0) / 100)).toFixed(2));
              const totalPrice = Number((unitPrice * product.quantity).toFixed(2));
              return {
                groupName: groupName,
                productId: product.product.id,
                productName: product.product.reference,
                productReference: product.product.reference ?? '',
                productDesignation: product.product.shortDescription,
                quantity: product.quantity,
                reduction: business.reduction ?? 0,
                taxDEEE: 0,
                publicUnitPrice: publicUnitPrice,
                unitPrice: unitPrice,
                totalPrice: totalPrice,
                virtualQty: product.product.virtualQty,
              };
            }),
          }))
          .filter(({ quotationDetails }) => quotationDetails.length > 0),
      ];

      const totalAmountHT = subQuotations.reduce(
        (acc, subQuotation) => acc + (subQuotation.quotationDetails?.reduce((acc, detail) => acc + detail.totalPrice, 0) ?? 0),
        0,
      );
      const shippingServicePrice = totalAmountHT < 1200 ? 25 : 0;
      const vat = business.exportTva ? Number(((totalAmountHT + shippingServicePrice) * 0.2).toFixed(2)) : 0;
      const totalAmount = totalAmountHT + shippingServicePrice + vat;

      const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();

      return saveSynopticBusiness({
        name: 'SYNOPTIQUE',
        businessPticId: business.id,
        businessNumber: business.numBusiness,
        vizeo: true,
        vizeoptik: true,
        synopticList: {
          version: 2.3,
          hddCalculationData: hddCalculationData,
          pages: pages,
          flowSize: {
            width: flowRect.width,
            height: flowRect.height,
          },
        },
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        profileId: business.profileId,
        profileName: business.profileName,
        profileEmail: business.profileEmail,
        updateSynoptic: true,
        quotationDto: {
          shippingServicePrice: shippingServicePrice,
          vat: vat,
          totalAmountHT: totalAmountHT,
          totalAmount: totalAmount,
          subQuotationList: subQuotations,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      queryClient.invalidateQueries({ queryKey: synopticBusinessQueryKeys._def });
      generateQuotationPdf();
      generateCommercialNoticePdf();
      toast.success("Les produits ont été transférés dans l'affaire avec succès");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors du transfert des produits dans l'affaire");
      onClose();
    },
  });

  const { mutate: generateStudyPdf } = useMutation({
    mutationFn: async (images: Array<Blob>) => {
      const pages = getPages();
      const synopticPages = pages.filter((page) => page.type === 'synoptic');
      const cameras = Object.entries(
        groupBy(
          synopticPages
            .flatMap((page) => page.nodes.filter((node): node is ExpertStudySynopticCameraNode => node.type === 'synopticCamera'))
            .map((node) => node),
          'data.productId',
        ),
      )
        .map(([key, value]) => {
          const product = products.find((product) => product.id === key);
          if (!product) return;
          return {
            product: product,
            quantity: value.reduce((acc, node) => acc + (node.data.quantity ?? 1), 0),
          };
        })
        .filter((product): product is { product: ProductResponseDto; quantity: number } => !!product);

      const flux = cameras.reduce((acc, camera) => {
        const flux1 = camera.product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX1')?.value ?? 0;
        const flux2 = camera.product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX2')?.value ?? 0;
        return acc + (flux1 + flux2) * camera.quantity;
      }, 0);

      const hddSpace = synopticPages
        .flatMap((page) => page.nodes.filter((node): node is ExpertStudyRecorderNode => node.type === 'recorder'))
        .reduce((acc, node) => {
          const product = products.find((product) => product.id === node.data.productId);
          const capacity =
            ((product?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value ?? 0) +
              node.data.options.reduce((acc, option) => {
                const capacity =
                  (products.find((product) => product.id === option.id)?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')
                    ?.value ?? 0) * option.quantity;

                return acc + capacity;
              }, 0)) *
            (node.data.quantity ?? 1);
          return acc + capacity;
        }, 0);

      const hoursPerDay = getHddCalculationHoursPerDay();

      const hddCalculationDays =
        (1024 * hddSpace) /
        (((flux / // Kbps
          8) * // KBps
          3600) / // KB per hour
          1024 / // MB per hour
          1024) / // GB per hour
        hoursPerDay;

      const showDensityImages = !pages.some((page) => page.type === 'density');

      const densityStats = pages
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

      return pdf(
        <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent
          images={images}
          cameras={cameras}
          hddSpace={hddSpace}
          hddCalculationDays={hddCalculationDays}
          business={business}
          showDensityImages={showDensityImages}
          hddCalculationHoursPerDay={hoursPerDay}
          densityStats={densityStats}
        />,
      ).toBlob();
    },
    onSuccess: (blob) => {
      setStudyPdf(new File([blob], formatFileName(`${business.numBusiness.replace(' ', '')}-${business.title ?? ''}.pdf`), { type: blob.type }));
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du PDF');
      onClose();
    },
  });

  useEffect(() => {
    const pages = getPages();

    const next = () => {
      const next = Array.from({ length: pages.length }, (_, index) => index).find(
        (pageIndex) => !data.current.has(pageIndex) && pages[pageIndex].nodes.length > 0,
      );
      if (next !== undefined) setCurrentPage(next);
      else
        generateStudyPdf(
          Array.from(data.current.entries())
            .sort(([a], [b]) => a - b)
            .map(([, blob]) => blob),
        );
    };

    if (pages[currentPage].nodes.length === 0) next();
    else if (nodesInitialized) {
      toBlob(document.querySelector('.react-flow') as HTMLElement, {
        quality: 1,
        cacheBust: true,
      })
        .then((blob) => {
          data.current.set(currentPage, blob!);
          next();
        })
        .catch((error) => {
          console.error('pdf generation error', error);
          toast.error('Une erreur est survenue lors de la génération du PDF');
          onClose();
        });
    }
  }, [nodesInitialized, currentPage]);

  useEffect(() => {
    if (!studyPdf || commercialNoticePdf == undefined) return;
    if (commercialNoticePdf === null) {
      setFinalStudyPdf(studyPdf);
      return;
    }
    const merger = new PDFMerger();
    (async () => {
      console.log('studyPdf', studyPdf);
      await merger.add(new Uint8Array(await studyPdf.arrayBuffer()));
      await merger.add(new Uint8Array(await commercialNoticePdf.arrayBuffer()));
      const result = await merger.saveAsBuffer();

      setFinalStudyPdf(new File([result], formatFileName(`${business.numBusiness.replace(' ', '')}-${business.title ?? ''}.pdf`), { type: 'application/pdf' }));
    })();
  }, [studyPdf, commercialNoticePdf]);

  useEffect(() => {
    saveSynopticBusinessWithQuotation();
    fetchRepresentative();
  }, []);

  useEffect(() => {
    console.log({ finalStudyPdf, quotationPdf, commercialNoticePdf, isFetchingRepresentative });
    if (!!finalStudyPdf && !!quotationPdf && commercialNoticePdf !== undefined && !isFetchingRepresentative)
      onGenerated({ studyPdf: finalStudyPdf, quotationPdf, commercialNoticePdf, representative });
  }, [finalStudyPdf, quotationPdf, commercialNoticePdf, isFetchingRepresentative]);

  return <LoaderModal />;
}
