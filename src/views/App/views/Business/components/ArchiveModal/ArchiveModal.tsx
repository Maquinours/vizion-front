import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { archiveBusiness } from '../../../../../../utils/api/business';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './ArchiveModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId');

export default function AppViewBusinessViewArchiveModalComponent() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();
  const { businessModal } = routeApi.useSearch();

  const onClose = () => {
    navigate({ search: { businessModal: undefined }, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => archiveBusiness(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success("L'affaire a été archivée avec succès.");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'archivage de l'affaire.");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={businessModal === 'archive'}
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
            <p>Voulez vous vraiment archiver cette affaire ?</p>
            <p>Si oui, aucune autre action ne pourra être effectuée sur cette affaire.</p>
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
