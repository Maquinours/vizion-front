import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createBusinessQuotation } from '../../../../../../utils/api/businessQuotations';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../utils/enums/BusinessState';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');

type BusinessModalComponentDashboardComponentQuotationButtonComponentProps = Readonly<{
  business: BusinessResponseDto;
  goToNextStep: () => void;
}>;
export default function BusinessModalComponentDashboardComponentQuotationButtonComponent({
  business,
  goToNextStep,
}: BusinessModalComponentDashboardComponentQuotationButtonComponentProps) {
  // const navigate = routeApi.useNavigate();
  const queryClient = useQueryClient();

  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const totalAmountHT = 0;
      const shippingServicePrice = 25;
      const vat = 25 * 0.2;
      const totalAmount = totalAmountHT + shippingServicePrice + vat;
      return createBusinessQuotation({
        businessId: business.id,
        number: business.numBusiness,
        documentName: 'Devis',
        totalAmountHT,
        shippingServicePrice,
        vat,
        totalAmount,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      queryClient.setQueryData(queries['business-quotations'].detail._ctx.byBusinessId(business.id).queryKey, data);
      toast.success('Devis créé avec succès');
      goToNextStep();
      // navigate({ to: '../quotation', replace: true }); // TODO: go to quotation modal
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du devis');
    },
  });

  const onClick = () => {
    if (business.state === BusinessState.CREATED) mutate();
    else goToNextStep();
    //  navigate({ to: '../quotation', replace: true });
  };

  return (
    <button type="button" onClick={onClick} className="btn btn-secondary">
      {isPending ? 'Création du devis...' : 'Saisir un devis'}
    </button>
  );
}
