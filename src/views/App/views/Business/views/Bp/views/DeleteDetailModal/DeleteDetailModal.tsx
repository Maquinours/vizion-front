import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteDetailModal.module.scss';
import { deleteBusinessBpDetail } from '../../../../../../../../utils/api/businessBpDetails';
import BusinessBpResponseDto from '../../../../../../../../utils/types/BusinessBpResponseDto';
import { toast } from 'react-toastify';
import React from 'react';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp/delete-detail/$detailId');

export default function AppViewBusinessViewBpViewDeleteDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: detail } = useSuspenseQuery(queries['business-bp-details'].detail._ctx.byId(detailId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
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
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le produit définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
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
