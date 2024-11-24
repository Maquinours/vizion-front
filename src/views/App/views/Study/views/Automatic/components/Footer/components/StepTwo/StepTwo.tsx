import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Edge, Node, Viewport, useNodesInitialized, useReactFlow } from '@xyflow/react';
import { saveSynopticBusiness } from '../../../../../../../../../../utils/api/synoptic';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { SynopticRequestBusinessQuotationRequestSubQuotationRequestQuotationDetailsRequestDto } from '../../../../../../../../../../utils/types/SynopticRequestDto';
import { AutomaticStudyStep } from '../../../../Automatic';
import { AutomaticStudyFinalCameraNode } from '../../../Flow/components/FinalCameraNode/FinalCameraNode';
import AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponent from './components/PdfModal/PdfModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/automatic');

enum Modals {
  PDF = 1,
}

const getModels = async (nodes: Array<Node>, queryClient: QueryClient) => {
  const products = await queryClient.ensureQueryData({ ...queries.product.list, staleTime: Infinity });
  const models: Array<{ quantity: number; product: ProductResponseDto }> = [];

  for (const node of nodes.filter((node): node is AutomaticStudyFinalCameraNode => node.type === 'finalNode')) {
    const model = models.find((model) => model.product.reference === node.data.model.reference);
    if (model) model.quantity++;
    else {
      const product = products.find((product) => product.reference === node.data.model.reference);
      if (product) models.push({ quantity: 1, product });
    }
    for (const option of node.data.options) {
      const model = models.find((model) => model.product.reference === option.reference);
      if (model) model.quantity += option.qty;
      else {
        const product = products.find((product) => product.reference === option.reference);
        if (product) models.push({ quantity: option.qty, product });
      }
    }
  }
  return models;
};

type AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentProps = Readonly<{
  backupFlow: { nodes: Array<Node>; edges: Array<Edge>; viewport: Viewport };
  setStep: (step: AutomaticStudyStep) => void;
}>;
export default function AppViewStudyViewAutomaticViewFooterComponentStepTwoComponent({
  backupFlow,
  setStep,
}: AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentProps) {
  const queryClient = useQueryClient();
  const { getNodes, setNodes, setEdges, setViewport, fitView } = useReactFlow();

  const nodesInitialized = useNodesInitialized();

  const [currentModal, setCurrentModal] = useState<Modals>();

  const { businessId } = routeApi.useParams();

  const previousStep = () => {
    if (!backupFlow) return;
    setNodes(backupFlow.nodes);
    setEdges(backupFlow.edges);
    setViewport(backupFlow.viewport);
    setStep(AutomaticStudyStep.One);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const business = await queryClient.ensureQueryData({ ...queries.businesses.detail._ctx.byId(businessId), staleTime: Infinity });

      const nodes = getNodes();
      const models = await getModels(nodes, queryClient);

      const reduction = business.reduction ?? 0;

      const totalAmountHT = models.reduce((acc, model) => acc + model.quantity * (model.product.publicPrice ?? 0), 0);
      const reductedTotalAmountHT = Number((totalAmountHT - totalAmountHT * (reduction / 100)).toFixed(2));
      const shippingServicePrice = reductedTotalAmountHT > 1200 ? 0 : 25;
      const vat = Number(((totalAmountHT + shippingServicePrice) * 0.2).toFixed(2)); // 20% tax
      const totalAmount = totalAmountHT + shippingServicePrice + vat;
      const reductedTotalAmount = Number((totalAmount - totalAmount * (reduction / 100)).toFixed(2));

      const quotationDetails: Array<SynopticRequestBusinessQuotationRequestSubQuotationRequestQuotationDetailsRequestDto> = models.map((model) => {
        const publicPrice = model.product.publicPrice ?? 0;
        const unitPrice = Number((publicPrice - publicPrice * (reduction / 100)).toFixed(2));
        const totalPrice = Number((unitPrice * model.quantity).toFixed(2));
        return {
          groupName: 'Default',
          productId: model.product.id,
          productName: model.product.reference,
          productReference: model.product.reference ?? '',
          productDesignation: model.product.shortDescription,
          quantity: model.quantity,
          reduction,
          taxDEEE: 0,
          publicUnitPrice: publicPrice,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          virtualQty: false,
        };
      });

      return saveSynopticBusiness({
        name: 'SYNOPTIQUE',
        businessPticId: business.id,
        businessNumber: business.numBusiness,
        vizeo: false,
        vizeoptik: false,
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        profileId: business.profileId,
        profileName: business.profileName,
        profileEmail: business.profileEmail,
        updateSynoptic: true,
        quotationDto: {
          businessId: business.id,
          shippingServicePrice: shippingServicePrice,
          vat: vat,
          totalAmount: reductedTotalAmount,
          totalAmountHT: reductedTotalAmountHT,
          subQuotationList: [
            {
              name: 'Default',
              quotationDetails: quotationDetails,
            },
          ],
        },
      });
    },
    onSuccess: () => {
      toast.success("Liste envoyée dans l'affaire avec succès");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'envoi de la liste dans l'affaire");
    },
  });

  useEffect(() => {
    if (nodesInitialized) fitView();
  }, [nodesInitialized]);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setCurrentModal(Modals.PDF)}>
        Exporter en PDF
      </button>
      <button className="btn btn-primary" onClick={() => previousStep()}>
        Modifier
      </button>
      <button className="btn btn-secondary" disabled={isPending} onClick={() => mutate()}>
        {isPending ? 'Envoi en cours...' : "Envoyer la liste dans l'affaire"}
      </button>
      {currentModal === Modals.PDF && (
        <AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponent onClose={() => setCurrentModal(undefined)} />
      )}
    </>
  );
}
