import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import styles from './CreateAssistanceModal.module.scss';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createTechnicalSupport } from '../../../../../../utils/api/technicalSupports';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewCreateAssistanceModalComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { businessModal } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ search: { businessModal: undefined }, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createTechnicalSupport({
        name: '',
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        businessNum: business.numBusiness,
        predefinedTime: '00:00:00',
        cumulatedTime: '00:00:00',
        noBilledTime: '00:00:00',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['technical-supports']._def });
      toast.success("L'assistance a été créée avec succès.");
      // TODO: redirect to assistance page
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'assistance.");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={businessModal === 'create-assistance'}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Confirmation</h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Voulez vous créér une nouvelle assistance pour cette affaire ?</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" type="reset">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
