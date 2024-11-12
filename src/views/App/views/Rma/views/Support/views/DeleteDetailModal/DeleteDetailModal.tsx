import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteRmaSupportDetail } from '../../../../../../../../utils/api/rmaSupportDetail';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { rmaSupportDetailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/rmaSupportDetail';
import styles from './DeleteDetailModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/delete-detail/$detailId');

export default function AppViewRmaViewSupportViewDeleteDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { detailId } = routeApi.useParams();

  const { data: detail } = useSuspenseQuery(rmaSupportDetailQueryKeys.detail._ctx.byId(detailId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteRmaSupportDetail(detail.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success('Article supprimé avec succès');
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
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Supprimer un article</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div>
              <p>
                Vous êtes sur le point de supprimer le produit{' '}
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bolder' }}>{detail.productRef}</span> de numéro de série
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {detail.productSerialNumber}</span> de la prise en charge.
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>
            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.modal_buttons}>
              <button
                type="button"
                disabled={isPending}
                className="btn btn-primary-light"
                onClick={() => {
                  onClose();
                }}
              >
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
