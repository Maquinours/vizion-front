import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './DeleteDetailModal.module.scss';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { deleteBusinessArcDetail } from '../../../../../../../../utils/api/businessArcDetails';
import { toast } from 'react-toastify';
import React from 'react';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc/delete-detail/$detailId');

export default function AppViewBusinessViewArcViewDeleteDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-arc-details'].detail._ctx.byId(detailId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const totalAmountHT = arc.totalAmountHT ? arc.totalAmountHT - detail!.totalPrice : 0;
      const shippingServicePrice = arc.shippingServicePrice === 0 && (arc.totalAmountHT ?? 0) >= 1200 && totalAmountHT < 1200 ? 25 : arc.shippingServicePrice;
      const totalAmount = (totalAmountHT + shippingServicePrice) * 1.2;
      return deleteBusinessArcDetail(detail.id, {
        totalAmountHT,
        totalAmount,
        arcId: arc.id,
        shippingServicePrice,
      });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queries['business-arc-details'].detail._ctx.byId(detail.id).queryKey, exact: true });
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs']._def });
      queryClient.invalidateQueries({ queryKey: queries['business-arc-details']._def });
      toast.success('Détail supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du détail');
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>supprimer</span> le produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{detail.productReference}</span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le produit définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
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
