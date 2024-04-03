import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { ddnsQueryKeys } from '../../../../../../../../utils/constants/queryKeys/ddns';
import { deleteDdns, getDdnsById } from '../../../../../../../../utils/api/ddns';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import React from 'react';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/tools/ddns/delete/$ddnsId');

export default function AppViewToolsViewDdnsViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { ddnsId } = routeApi.useParams();

  const { data: ddns } = useSuspenseQuery({
    queryKey: ddnsQueryKeys.detailById(ddnsId),
    queryFn: () => getDdnsById(ddnsId),
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteDdns(ddns.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ddnsQueryKeys.all });
      toast.success('DDNS supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du DDNS');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Suppression du DDNS</h6>
        </div>
        <div className={styles.content}>
          <form onSubmit={onSubmit}>
            <div className={styles.content}>
              <p>
                Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le domaine{' '}
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{ddns.url}</span>
              </p>
              <p style={{ marginTop: '5px' }}>Cette action irréversible va supprimer ce DDNS définitivement.</p>
            </div>

            <div className={styles.loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.buttons}>
              <button className="btn btn-primary-light" disabled={isPending} onClick={() => onClose()}>
                Annuler
              </button>
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
