import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteFormationSubscription } from '../../../../../../../../../../utils/api/formationSubscriptions';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/tools/formations/subscribers/$formationDetailId/delete/$subscriptionId');

export default function AppViewToolsViewFormationsViewSubscribersModalViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { subscriptionId } = routeApi.useParams();

  const { data: subscription } = useSuspenseQuery(queries['formation-subscriptions'].detail._ctx.byId(subscriptionId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteFormationSubscription(subscription.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['formation-subscriptions']._def });
      toast.success('Le participant a été supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du participant');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)' }}>supprimer</span> le participant{' '}
            <span style={{ color: 'var(--secondary-color)' }}>
              {subscription.firstName} {subscription.lastName}{' '}
            </span>
            de cette formation ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer la formation du système.</p>
          </div>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
