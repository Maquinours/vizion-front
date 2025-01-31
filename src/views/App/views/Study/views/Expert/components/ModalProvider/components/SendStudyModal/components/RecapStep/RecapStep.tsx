import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import _ from 'lodash';
import { useMemo } from 'react';
import ReactModal from 'react-modal';
import { useShallow } from 'zustand/react/shallow';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { ExpertStudyMiscProductNode } from '../../../../../Flow/components/MiscProductNode/MiscProductNode';
import { ExpertStudyMonitorNode } from '../../../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudySynopticCameraNode } from '../../../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTransmitterNode } from '../../../../../Flow/components/TransmitterNode/TransmitterNode';
import useStore, { RFState } from '../../../../../Flow/utils/store';

type ProductNode = ExpertStudySynopticCameraNode | ExpertStudyMonitorNode | ExpertStudyRecorderNode | ExpertStudyTransmitterNode | ExpertStudyMiscProductNode;

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const selector = (state: RFState) => ({
  pages: state.pages,
  hddCalculationHoursPerDay: state.hddCalculationData.hoursPerDay,
});

type AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageRecapStepComponentProps = Readonly<{
  onClose: () => void;
  onConfirm: () => void;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageRecapStepComponent({
  onClose,
  onConfirm,
}: AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageRecapStepComponentProps) {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: enterprise } = useSuspenseQuery(queries.enterprise.detail(business.enterpriseId));
  const { data: products } = useSuspenseQuery({ ...queries.product.list, staleTime: Infinity });

  const { pages, hddCalculationHoursPerDay } = useStore(useShallow(selector));

  const { quantity, totalAmountHT, hddCalculationDays } = useMemo(() => {
    const productNodes = pages
      .filter((page) => page.type === 'synoptic')
      .flatMap((page) =>
        page.nodes.filter(
          (node): node is ProductNode => !!node.type && ['synopticCamera', 'monitor', 'recorder', 'transmitter', 'misc-product'].includes(node.type),
        ),
      );

    const { quantity, totalAmountHT, hddSpace, flux } = Object.entries(
      _.groupBy(
        [
          ...productNodes.map((node) => ({ productId: node.data.productId, quantity: node.data.quantity ?? 1 })),
          ...productNodes.reduce<Array<{ productId: string; quantity: number }>>(
            (acc, node) =>
              'options' in node.data ? [...acc, ...node.data.options.map((option) => ({ productId: option.id, quantity: option.quantity }))] : acc,
            [],
          ),
        ],
        (node) => node.productId,
      ),
    ).reduce<{ quantity: number; totalAmountHT: number; hddSpace: number; flux: number }>(
      (acc, [productId, productsData]) => {
        const product = products.find((product) => product.id === productId);
        if (!product) return acc;
        const productQuantity = productsData.reduce((acc, productData) => acc + productData.quantity, 0);
        const quantity = acc.quantity + productQuantity;
        const totalAmountHT = acc.totalAmountHT + (product.publicPrice ?? 0) * productQuantity * (1 - (business.reduction ?? 0) / 100);
        const hddSpace = acc.hddSpace + (product.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value ?? 0) * productQuantity;
        const flux =
          acc.flux +
          ((product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX1')?.value ?? 0) +
            (product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX2')?.value ?? 0)) *
            productQuantity;
        return { quantity, totalAmountHT, hddSpace, flux };
      },
      { quantity: 0, totalAmountHT: 0, hddSpace: 0, flux: 0 },
    );

    const hddCalculationDays =
      (1024 * hddSpace) /
      (((flux / // Kbps
        8) * // KBps
        3600) / // KB per hour
        1024 / // MB per hour
        1024) / // GB per hour
      hddCalculationHoursPerDay;

    return { quantity, totalAmountHT, hddCalculationDays };
  }, [pages, hddCalculationHoursPerDay, business.reduction]);

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute top-2/4 left-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
    >
      <div className="w-full rounded-md bg-white pb-2">
        <div className="flex flex-col gap-y-4 p-4 text-[var(--primary-color)]">
          <div className="flex flex-row">
            <span className="text-right">Entreprise : </span>
            <span className="text-left">{enterprise.name}</span>
          </div>
          <div className="flex flex-row">
            <span className="text-right">Catégorie : </span>
            <span className="text-left">{enterprise.category}</span>
          </div>
          <div className="flex flex-row">
            <span className="text-right">Remise : </span>
            <AmountFormat value={business.reduction ?? 0} suffix="%" decimalScale={0} className="text-left" />
          </div>
          <div className="flex flex-row">
            <span className="text-right">Nombre d&apos;articles : </span>
            <AmountFormat value={quantity} className="text-left" decimalScale={0} />
          </div>
          <div className="flex flex-row">
            <span className="text-right">Temps d&apos;enregistrement : </span>
            <AmountFormat value={hddCalculationDays} suffix=" jours" decimalScale={2} displayType="text" className="text-left" />
          </div>
          <div className="flex flex-row">
            <span className="text-right">Montant total HT : </span>
            <CurrencyFormat value={totalAmountHT} displayType="text" className="text-left" />
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Annuler
          </button>
          <button type="button" onClick={onConfirm} className="btn btn-primary">
            Continuer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
