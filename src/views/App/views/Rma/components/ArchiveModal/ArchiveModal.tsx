import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import styles from './ArchiveModal.module.scss';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { archiveRma } from '../../../../../../utils/api/rma';
import { toast } from 'react-toastify';
import React from 'react';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId');

export default function AppViewRmaViewArchiveModalComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onClose = () => {
    navigate({ search: (old) => ({ ...old, rmaModal: undefined }) });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => archiveRma(rma.id),
    onSuccess: (rma) => {
      queryClient.setQueryData(queries.rmas.detail(rma.id).queryKey, rma);
      toast.success('Assistance archivée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'archivage de l'assistance");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={!process}
      shouldCloseOnEsc={!process}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>{"Archiver l'assistance"}</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={(e) => onSubmit(e)}>
            <div>
              <p>
                {"Vous êtes sur le point d'archiver cette assistance"} (
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bolder' }}> {rma.number}</span>)
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>
            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.modal_buttons}>
              <button type="button" className="btn btn-primary-light" onClick={() => onClose()} disabled={isPending}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary" disabled={isPending}>
                Archiver
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
