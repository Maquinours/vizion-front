import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './DeleteModal.module.scss';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { mailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/mails';
import { deleteMail } from '../../../../../../../../utils/api/mails';
import { toast } from 'react-toastify';
import React from 'react';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/tools/mails/delete/$mailId');

export default function AppViewToolsViewMailsViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { mailId } = routeApi.useParams();

  const { data: mail } = useSuspenseQuery(mailQueryKeys.detail._ctx.byId(mailId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteMail(mail.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailQueryKeys._def });
      toast.success('Le courrier a été supprimé avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du courrier.');
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le courrier{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{mail.reference}</span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le courrier définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={() => onClose()}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
