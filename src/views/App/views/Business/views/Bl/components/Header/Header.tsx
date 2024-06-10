import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';
import { createBusinessBill } from '../../../../../../../../utils/api/businessBill';
import { toast } from 'react-toastify';
import styles from './Header.module.scss';

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
    onSuccess: (bill) => {
      queryClient.setQueryData(queries['business-bills'].list._ctx.byBusinessId(business.id).queryKey, [bill]);
      toast.success('Facture créée avec succès');
      navigate({ to: '../bill', replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création de la facture');
    },
  });

  return (
    <div className={styles.edit_container}>
      <div className={styles.business_info}>
        <span>{business.enterpriseName}</span> / <span>{business.title}</span>
      </div>
      {!business.archived && business.state === BusinessState.BL && (
        <button disabled={isCreatingBill} className="btn btn-secondary" onClick={() => createBill()}>
          {isCreatingBill ? 'Edition de la facture...' : 'Editer Facture'}
        </button>
      )}
    </div>
  );
}
