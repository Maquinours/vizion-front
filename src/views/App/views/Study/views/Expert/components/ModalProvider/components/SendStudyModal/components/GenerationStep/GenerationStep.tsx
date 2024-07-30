import { pdf } from '@react-pdf/renderer';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useNodesInitialized } from '@xyflow/react';
import { toBlob } from 'html-to-image';
import { groupBy } from 'lodash';
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
import { ExpertStudyServiceNode } from '../../../../../Flow/components/ServiceNode/ServiceNode';
import { synopticBusinessQueryKeys } from '../../../../../../../../../../../../utils/constants/queryKeys/synoptic';
import { SynopticRequestBusinessQuotationRequestSubQuotationRequestDto } from '../../../../../../../../../../../../utils/types/SynopticRequestDto';

type ProductNode = ExpertStudySynopticCameraNode | ExpertStudyMonitorNode | ExpertStudyRecorderNode | ExpertStudyTransmitterNode | ExpertStudyServiceNode;

const GROUPS = [
  {
    name: 'Caméras',
    categories: ['Caméra interieure', 'Caméra exterieure', 'Caméra universelle', 'Dôme motorisé', 'Autres cameras'],
  },
  { name: 'NVR', categories: ['Transmission', 'NVR'] },
  { name: 'Affichage', categories: ['Moniteur'] },
];

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

const selector = (state: RFState) => ({
  getCurrentPage: state.getCurrentPage,
  getPages: state.getPages,
  setCurrentPage: state.setCurrentPage,
});

type AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponentProps = Readonly<{
  onClose: () => void;
  onGenerated: ({ quotationPdf, studyPdf }: { quotationPdf: File; studyPdf: File; representative: EnterpriseResponseDto | undefined }) => void;
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

  const { mutate: generateQuotationPdf } = useMutation({
    mutationFn: async () => {
      const quotation = await queryClient.ensureQueryData(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
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

  const { mutate: saveSynopticBusinessWithQuotation } = useMutation({
    mutationFn: async () => {
      const pages = getPages();

      const [products, business] = await Promise.all([
        queryClient.ensureQueryData(queries.product.list),
        queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)),
      ]);

      const synopticPages = pages.filter((page) => page.type === 'synoptic');
      const productNodes = synopticPages.flatMap((page) =>
        page.nodes.filter(
          (node): node is ProductNode => !!node.type && ['synopticCamera', 'monitor', 'recorder', 'transmitter', 'service'].includes(node.type),
        ),
      );
      const productsData = productNodes.reduce((acc: Array<{ product: ProductResponseDto; quantity: number; groupName: string }>, node) => {
        const product = products.find((product) => product.id === node.data.productId);
        if (!product) return acc;
        const quantity = 'quantity' in node.data && node.data.quantity !== undefined ? node.data.quantity : 1;
        const data = acc.find((data) => data.product.id === node.data.productId);
        const groupName =
          data?.groupName ?? (GROUPS.find((group) => !!product.category && group.categories.includes(product.category))?.name || product.category || 'Autres');
        if (!!data) data.quantity += quantity;
        else
          acc.push({
            product: product,
            quantity: quantity,
            groupName: groupName,
          });
        if ('options' in node.data)
          for (const option of node.data.options) {
            const data = acc.find((data) => data.product.id === option.id && data.groupName === groupName);
            if (!!data) data.quantity += option.quantity;
            else {
              const product = products.find((product) => product.id === option.id);
              if (!!product) acc.push({ product: product, quantity: option.quantity, groupName: groupName });
            }
          }
        return acc;
      }, []);

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
        }));

      const totalAmountHT = subQuotations.reduce(
        (acc, subQuotation) => acc + (subQuotation.quotationDetails?.reduce((acc, detail) => acc + detail.totalPrice, 0) ?? 0),
        0,
      );
      const shippingServicePrice = totalAmountHT < 1200 ? 0 : 25;
      const vat = Number(((totalAmountHT + shippingServicePrice) * 0.2).toFixed(2));
      const totalAmount = totalAmountHT + shippingServicePrice + vat;

      return saveSynopticBusiness({
        name: 'SYNOPTIQUE',
        businessPticId: business.id,
        businessNumber: business.numBusiness,
        vizeo: true,
        vizeoptik: true,
        synopticList: {
          version: 2,
          pages: pages,
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
      const pages = getPages().filter((page) => page.type === 'synoptic');
      const cameras = Object.entries(
        groupBy(
          pages.flatMap((page) => page.nodes.filter((node): node is ExpertStudySynopticCameraNode => node.type === 'synopticCamera')).map((node) => node),
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

      const hddSpace = pages
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

      return pdf(
        <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent
          images={images}
          cameras={cameras}
          hddSpace={hddSpace}
          hddCalculationDays={hddCalculationDays}
          business={business}
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
    if (nodesInitialized) {
      toBlob(document.querySelector('.react-flow') as HTMLElement, {
        quality: 1,
      })
        .then((blob) => {
          data.current.set(getCurrentPage(), blob!);
          const next = Array.from({ length: getPages().length }, (_, index) => index).find((pageIndex) => !data.current.has(pageIndex));
          if (next !== undefined) setCurrentPage(next);
          else
            generateStudyPdf(
              Array.from(data.current.entries())
                .sort(([a], [b]) => a - b)
                .map(([_, blob]) => blob),
            );
        })
        .catch((error) => {
          console.error('pdf generation error', error);
          toast.update('pdf-generation', {
            type: 'error',
            autoClose: 3000,
            closeButton: true,
            render: 'Une erreur est survenue lors de la génération du PDF, veuillez réessayer ultérieurement.',
            isLoading: false,
            toastId: 'pdf-generation-error',
          });
          onClose();
        });
    }
  }, [nodesInitialized]);

  useEffect(() => {
    saveSynopticBusinessWithQuotation();
    fetchRepresentative();
  }, []);

  useEffect(() => {
    if (!!studyPdf && !!quotationPdf && !isFetchingRepresentative) onGenerated({ studyPdf, quotationPdf, representative });
  }, [studyPdf, quotationPdf, isFetchingRepresentative]);

  return <LoaderModal />;
}
