import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { deletePredefinedMessage, getPredefinedMessageById } from '../../../../../../../../utils/api/predefinedMessage';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import styles from './DeleteModal.module.scss';
import { predefinedMessageQueryKeys } from '../../../../../../../../utils/constants/queryKeys/predefinedMessage';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/tools/predefined-messages/delete/$predefinedMessageId');

export default function AppViewToolsViewPredefinedMessagesViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { predefinedMessageId } = routeApi.useParams();

  const { data: predefinedMessage } = useSuspenseQuery({
    queryKey: predefinedMessageQueryKeys.detailById(predefinedMessageId),
    queryFn: () => getPredefinedMessageById(predefinedMessageId),
  });

  const onClose = () => {
    navigate({ to: './create', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePredefinedMessage(predefinedMessageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: predefinedMessageQueryKeys.all });
      toast.success('Message prédéfini supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du message prédéfini');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.delete_contact_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)' }}>supprimer</span> le message prédéfini {predefinedMessage.title} ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le document définitivement.</p>
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
