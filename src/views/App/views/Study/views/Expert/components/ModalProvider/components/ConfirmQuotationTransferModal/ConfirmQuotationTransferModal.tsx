import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { groupBy } from 'lodash';
import { useContext } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { saveSynopticBusiness } from '../../../../../../../../../../utils/api/synoptic';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { SynopticRequestBusinessQuotationRequestSubQuotationRequestDto } from '../../../../../../../../../../utils/types/SynopticRequestDto';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudyMonitorNode } from '../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudyMiscProductNode } from '../../../Flow/components/MiscProductNode/MiscProductNode';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTransmitterNode } from '../../../Flow/components/TransmitterNode/TransmitterNode';
import useStore, { RFState } from '../../../Flow/utils/store';

type ProductNode = ExpertStudySynopticCameraNode | ExpertStudyMonitorNode | ExpertStudyRecorderNode | ExpertStudyTransmitterNode | ExpertStudyMiscProductNode;

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const GROUPS = [
  {
    name: 'Caméras',
    categories: ['Caméra interieure', 'Caméra exterieure', 'Caméra universelle', 'Dôme motorisé', 'Autres cameras'],
  },
  { name: 'NVR', categories: ['Transmission', 'NVR'] },
  { name: 'Affichage', categories: ['Moniteur'] },
];

const selector = (state: RFState) => ({
  getPages: state.getPages,
});

export default function AppViewStudyViewExpertViewModalProviderComponentConfirmQuotationTransferModalComponent() {
  const queryClient = useQueryClient();

  const { getPages } = useStore(useShallow(selector));

  const { setModal } = useContext(ExpertStudyContext)!;

  const { businessId } = routeApi.useParams();

  const onClose = () => {
    setModal(undefined);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const pages = getPages();

      const [products, business] = await Promise.all([
        queryClient.ensureQueryData({ ...queries.product.list, staleTime: Infinity }),
        queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)),
      ]);

      const synopticPages = pages.filter((page) => page.type === 'synoptic' && page.nodes.some((node) => node.type === 'recorder'));
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
      toast.success("Les produits ont été transférés dans l'affaire avec succès");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors du transfert des produits dans l'affaire");
    },
  });

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-[2005] m-auto h-auto w-auto min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-md p-0 opacity-100"
      overlayClassName="Overlay"
    >
      <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[#16204e] text-white">Transfert des produits dans l&apos;affaire</h2>
      <div className="w-full rounded-b-md bg-white p-2">
        <div className="flex flex-col gap-y-1 p-2 text-center">
          <span className="text-center">Vous êtes sur le point de transférer les produits de la synoptique vers l&apos;affaire.</span>
          <span className="font-bold text-[var(--secondary-color)]">Si un devis existe déjà, il sera écrasé.</span>
          <span>Voulez-vous continuer ?</span>
        </div>
        <div className="flex justify-center gap-x-1 py-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button disabled={isPending} className="btn btn-primary" onClick={() => mutate()}>
            {isPending ? 'Transfert en cours...' : 'Transférer'}
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
