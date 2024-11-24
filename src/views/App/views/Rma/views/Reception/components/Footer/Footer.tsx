import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { createRmaDelivery } from '../../../../../../../../utils/api/rmaDelivery';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../../../../../utils/enums/AssistanceState';
import styles from './Footer.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/reception');

export default function AppViewRmaViewReceptionViewFooterComponent() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const navigateToNextStep = () => {
    navigate({ to: '/app/businesses-rma/rma/$rmaId/delivery', replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createRmaDelivery({
        assistanceId: rmaId,
        detailDtoList: rma.assistanceReception?.details?.map(
          ({ productRef, productSerialNumber, businessNum, issue, warranty, externalComment, internalComment }) => ({
            productRef,
            productSerialNumber,
            businessNum,
            issue,
            warranty,
            comment: externalComment,
            found: false,
            solution: '',
            internalComment,
          }),
        ),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success('RMA passé en analyse avec succès');
      navigateToNextStep();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de l'état du RMA.");
    },
  });

  const onNextStepButtonClick = () => {
    if (rma.state !== AssistanceState.RECEPTION) navigateToNextStep();
    else mutate();
  };

  return (
    <div className={styles.footer_buttons}>
      <button className="btn btn-secondary" onClick={() => onNextStepButtonClick()}>
        {isPending ? "Passage à 'étape suivante..." : 'Étape suivante'}
      </button>
    </div>
  );
}
