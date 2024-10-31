import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteBusinessBpDetail } from '../../../../../../../../utils/api/businessBpDetails';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessBpResponseDto from '../../../../../../../../utils/types/BusinessBpResponseDto';
import styles from './DeleteDetailModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp/delete-detail/$detailId');

export default function AppViewBusinessViewBpViewDeleteDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId, detailId } = routeApi.useParams();

  const { data: detail } = useSuspenseQuery(queries['business-bp-details'].detail._ctx.byId(detailId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteBusinessBpDetail(detail.id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queries['business-bp-details'].detail._ctx.byId(detailId).queryKey, exact: true });
      queryClient.setQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(businessId).queryKey, (old) =>
        old
          ? {
              ...old,
              bpDetailsList: old.bpDetailsList.filter((bpDetail) => bpDetail.id !== detailId),
            }
          : old,
      );
      queryClient.invalidateQueries({ queryKey: queries['business-bps']._def });
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
