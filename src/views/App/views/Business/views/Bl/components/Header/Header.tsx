import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';
import { createBusinessBill } from '../../../../../../../../utils/api/businessBill';
import { toast } from 'react-toastify';
import styles from './Header.module.scss';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bl');

export default function AppViewBusinessViewBlViewHeaderComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { mutate: createBill, isPending: isCreatingBill } = useMutation({
    mutationFn: () =>
      createBusinessBill({
        numBusiness: business.numBusiness,
        numOrder: business.numOrder,
        businessId: business.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-bills']._def });
      queryClient.invalidateQueries({ queryKey: queries['businesses']._def });
      toast.success('Facture créée avec succès');
      navigate({ to: '../bill', replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création de la facture');
    },
  });

  const onCreateBill = () => {
    if (!business.deliverAddressZipCode || business.deliverAddressZipCode.length < 2) {
      toast.warning('Impossible de passer en facture : Le CP de livraison est invalide.');
      navigate({ to: '/app/businesses-rma/business/$businessId/dashboard', params: { businessId }, replace: true });
    } else createBill();
  };

  return (
    <div className={styles.edit_container}>
      <div className={styles.business_info}>
        <span>{business.enterpriseName}</span> / <span>{business.title}</span>
      </div>
      {!business.archived && business.state === BusinessState.BL && business.enterpriseCategory !== CategoryClient.FOURNISSEUR && (
        <button disabled={isCreatingBill} className="btn btn-secondary" onClick={onCreateBill}>
          {isCreatingBill ? 'Édition de la facture...' : 'Éditer Facture'}
        </button>
      )}
    </div>
  );
}
