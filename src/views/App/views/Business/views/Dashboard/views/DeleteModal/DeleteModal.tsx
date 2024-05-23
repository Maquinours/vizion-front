import ReactModal from 'react-modal';
import styles from './DeleteModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { deleteBusiness } from '../../../../../../../../utils/api/business';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/delete');

export default function AppViewBusinessViewDashboardViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteBusiness(business.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success("L'affaire a bien été supprimée");
      navigate({ to: '/app/businesses-rma', search: (old) => old, replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la suppression de l'affaire");
    },
  });

  return (
    <ReactModal isOpen={true} className={styles.modal} onRequestClose={onClose} overlayClassName="Overlay">
      <div className={styles.content}>
        <h1 className={styles.title}>
          Êtes vous certain de vouloir <span className={styles.secondary_color}>supprimer</span> {"l'affaire "}
          {business.title || business.numBusiness} ?
        </h1>
        <p className={styles.text}>
          Cette action irréversible va <span className={styles.bold}>supprimer</span> {"l'affaire définitivement."}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1rem 0',
          }}
        >
          <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>
        <div className={styles.buttons_container}>
          <button className="btn btn-primary-light" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-secondary" onClick={() => mutate()}>
            Supprimer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
