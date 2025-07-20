import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createRmaReception } from '../../../../../../utils/api/rmaReception';
import { queries } from '../../../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../../../utils/enums/AssistanceState';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import styles from './Header.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

type RmaModalComponentSupportComponentHeaderComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  navigateToNextStep: () => void;
  onCreateDetailClick: () => void;
  onEditClick: () => void;
}>;
export default function RmaModalComponentSupportComponentHeaderComponent({
  rma,
  navigateToNextStep,
  onCreateDetailClick,
  onEditClick,
}: RmaModalComponentSupportComponentHeaderComponentProps) {
  const queryClient = useQueryClient();
  // const navigate = routeApi.useNavigate();

  // const { rmaId } = routeApi.useParams();

  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  // const navigateToNextStep = () => {
  //   navigate({ to: '/app/businesses-rma/rma/$rmaId/reception', replace: true });
  // };

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
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
      navigateToNextStep();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création de la réception.');
    },
  });

  const onNextStepButtonClick = () => {
    if (rma.state !== AssistanceState.PRISE_EN_CHARGE) navigateToNextStep();
    else mutate();
  };

  return (
    <div className={styles.header}>
      <div className={styles.buttons_container}>
        {rma.state !== AssistanceState.ARCHIVE && (
          <button className="btn btn-primary" onClick={onCreateDetailClick}>
            Ajouter un article
          </button>
          // <Link
          //   from="/app/businesses-rma/rma/$rmaId/support"
          //   to="create-detail"
          //   search
          //   replace
          //   resetScroll={false}
          //   preload="intent"
          //   className="btn btn-primary"
          // >
          //   Ajouter un article
          // </Link>
        )}
        <button className="btn btn-secondary" onClick={onEditClick}>
          Éditer
        </button>
        {/* <Link from="/app/businesses-rma/rma/$rmaId/support" to="pdf" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Éditer
        </Link> */}
        <button type="button" disabled={isPending} className="btn btn-secondary" onClick={() => onNextStepButtonClick()}>
          {isPending ? "Passage à l'étape suivante..." : 'Étape suivante'}
        </button>
      </div>
    </div>
  );
}
