import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { createBusinessQuotation } from '../../../../../../../../utils/api/businessQuotations';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

export default function AppViewBusinessViewDashboardViewQuotationButtonComponent() {
  const navigate = useNavigate({ from: routeApi.id });
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createBusinessQuotation({
        businessId: business.id,
        number: business.numBusiness,
        documentName: 'Devis',
        shippingServicePrice: 25,
        vat: 0.2,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      queryClient.setQueryData(queries['business-quotations'].detail._ctx.byBusinessId(business.id).queryKey, data);
      toast.success('Devis créé avec succès');
      navigate({ to: '../quotation', replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du devis');
    },
  });

  const onClick = () => {
    if (business.state === BusinessState.CREATED) mutate();
    else navigate({ to: '../quotation', replace: true });
  };

  return (
    <button onClick={onClick} className="btn btn-secondary">
      {isPending ? 'Création du devis...' : 'Saisir un devis'}
    </button>
  );
}
