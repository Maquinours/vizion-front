import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './DeleteDetailModal.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRmaDeliveryDetail } from '../../../../../../../../utils/api/rmaDeliveryDetail';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import React from 'react';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/delivery/delete-detail/$detailId');

export default function AppViewRmaViewDeliveryViewDeleteDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { detail } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteRmaDeliveryDetail(detail.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success("L'article a été supprimé avec succès");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression de l'article");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Supprimer un article</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={(e) => onSubmit(e)}>
            <div>
              <p>
                Vous êtes sur le point de supprimer le produit{' '}
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bolder' }}> {detail.productRef}</span> de numéro de série
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {detail.productSerialNumber}</span>.
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>
            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.modal_buttons}>
              <button
                type="button"
                className="btn btn-primary-light"
                onClick={() => {
                  onClose();
                }}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
