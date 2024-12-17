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
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { formatFileName } from '../../../../../../../../../../../../utils/functions/files';
import EnterpriseResponseDto from '../../../../../../../../../../../../utils/types/EnterpriseResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from '../../../../../../../../../Business/views/Quotation/views/PdfModal/components/Pdf/Pdf';
import { ExpertStudyRecorderNode } from '../../../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudySynopticCameraNode } from '../../../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import useStore, { RFState } from '../../../../../Flow/utils/store';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent from '../../../PdfModal/components/ShowStep/components/Pdf/Pdf';
import { saveSynopticBusiness } from '../../../../../../../../../../../../utils/api/synoptic';
import { ExpertStudyMonitorNode } from '../../../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyTransmitterNode } from '../../../../../Flow/components/TransmitterNode/TransmitterNode';
import { ExpertStudyMiscProductNode } from '../../../../../Flow/components/MiscProductNode/MiscProductNode';
import { synopticBusinessQueryKeys } from '../../../../../../../../../../../../utils/constants/queryKeys/synoptic';
import { SynopticRequestBusinessQuotationRequestSubQuotationRequestDto } from '../../../../../../../../../../../../utils/types/SynopticRequestDto';

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
  getCurrentPage: state.getCurrentPage,
  getPages: state.getPages,
  setCurrentPage: state.setCurrentPage,
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

  const { getCurrentPage, getPages, setCurrentPage } = useStore(useShallow(selector));

  const nodesInitialized = useNodesInitialized();

  const data = useRef<Map<number, Blob>>(new Map());

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: products } = useSuspenseQuery(queries.product.list);

  const [studyPdf, setStudyPdf] = useState<File>();
  const [quotationPdf, setQuotationPdf] = useState<File>();
  const [representative, setRepresentative] = useState<EnterpriseResponseDto>();
  const [commercialNoticePdf, setCommercialNoticePdf] = useState<File | null>();

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
        .filter((data) => data.quantity > 0);

      const subQuotations: Array<SynopticRequestBusinessQuotationRequestSubQuotationRequestDto> = Object.entries(groupBy(productsData, 'groupName'))
        .sort(([a], [b]) => {
          const aIndex = GROUPS.findIndex((group) => group.name === a);
          const bIndex = GROUPS.findIndex((group) => group.name === b);
          return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        })
        .map(([groupName, products], index) => ({
          name: groupName,
          orderNum: `${index}`,
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
        .filter(({ quotationDetails }) => quotationDetails.length > 0);

      const totalAmountHT = subQuotations.reduce(
        (acc, subQuotation) => acc + (subQuotation.quotationDetails?.reduce((acc, detail) => acc + detail.totalPrice, 0) ?? 0),
        0,
      );
      const shippingServicePrice = totalAmountHT < 1200 ? 25 : 0;
      const vat = Number(((totalAmountHT + shippingServicePrice) * 0.2).toFixed(2));
      const totalAmount = totalAmountHT + shippingServicePrice + vat;

      const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();

      return saveSynopticBusiness({
        name: 'SYNOPTIQUE',
        businessPticId: business.id,
        businessNumber: business.numBusiness,
        vizeo: true,
        vizeoptik: true,
        synopticList: {
          version: 2.2,
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
            (product?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value ?? 0) +
            node.data.options.reduce((acc, option) => {
              const capacity =
                (products.find((product) => product.id === option.id)?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value ??
                  0) * option.quantity;

              return acc + capacity;
            }, 0);
          return acc + capacity;
        }, 0);

      const HOURS_PER_DAY = 24;

      const hddCalculationDays =
        (1024 * hddSpace) /
        (((flux / // Kbps
          8) * // KBps
          3600) / // KB per hour
          1024 / // MB per hour
          1024) / // GB per hour
        HOURS_PER_DAY;

      const showDensityImages = !pages.some((page) => page.type === 'density');

      return pdf(
        <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent
          images={images}
          cameras={cameras}
          hddSpace={hddSpace}
          hddCalculationDays={hddCalculationDays}
          business={business}
          showDensityImages={showDensityImages}
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
    const currentPage = getCurrentPage();

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
  }, [nodesInitialized]);

  useEffect(() => {
    saveSynopticBusinessWithQuotation();
    fetchRepresentative();
  }, []);

  useEffect(() => {
    if (!!studyPdf && !!quotationPdf && commercialNoticePdf !== undefined && !isFetchingRepresentative)
      onGenerated({ studyPdf, quotationPdf, commercialNoticePdf, representative });
  }, [studyPdf, quotationPdf, commercialNoticePdf, isFetchingRepresentative]);

  return <LoaderModal />;
}
