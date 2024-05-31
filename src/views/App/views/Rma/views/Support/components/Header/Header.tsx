import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import styles from './Header.module.scss';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../../../../../utils/enums/AssistanceState';
import { createRmaReception } from '../../../../../../../../utils/api/rmaReception';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support');

export default function AppViewRmaViewSupportViewHeaderComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (rma.state !== AssistanceState.PRISE_EN_CHARGE) throw new Error('INVALID_STATE');
      return createRmaReception({
        assistanceId: rma.id,
        detailDtoList: rma.assistanceSupport?.details?.map(({ productRef, productSerialNumber, businessNum, issue, warranty, comment, internalComment }) => ({
          productRef,
          productSerialNumber,
          businessNum,
          issue,
          warranty,
          externalComment: comment,
          internalComment,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success('RMA passé en réception avec succès.');
      navigate({ to: '/app/businesses-rma/rma/$rmaId/reception' });
    },
    onError: (error) => {
      if (!isAxiosError(error) && error.message === 'INVALID_STATE') navigate({ to: '/app/businesses-rma/rma/$rmaId/reception' });
      else {
        console.error(error);
        toast.error('Une erreur est survenue lors de la création de la réception.');
      }
    },
  });

  return (
    <div className={styles.header}>
      <div className={styles.buttons_container}>
        {rma.state !== AssistanceState.ARCHIVE && (
          <Link from={routeApi.id} to="create-detail" search replace resetScroll={false} className="btn btn-primary">
            Ajouter un article
          </Link>
        )}
        <Link from={routeApi.id} to="pdf" search replace resetScroll={false} className="btn btn-secondary">
          Editer
        </Link>
        <button type="button" disabled={isPending} className="btn btn-secondary" onClick={() => mutate()}>
          {isPending ? "Passage à l'étape suivante..." : 'Étape suivante'}
        </button>
      </div>
    </div>
  );
}
