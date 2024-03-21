import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { deleteProgressiveInfo } from './utils/api/progressiveInfo';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { progressiveInfoQueryKeys } from '../../../../../../utils/constants/queryKeys/progressiveInfo';
import { getProgressiveInfoById } from '../../../../../../utils/api/progressiveInfo';
import { toast } from 'react-toastify';
import ProgressiveInfoResponseDto from '../../../../../../utils/types/ProgressiveInfoResponseDto';
import styles from './DeleteProgressiveInfoModal.module.scss';
import React from 'react';

const Route = getRouteApi('/app/dashboard/delete-progressive-info/$progressiveInfoId');

export default function AppViewDashboardViewDeleteProgressiveInfoModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { progressiveInfoId: id } = Route.useParams();

  useSuspenseQuery({
    queryKey: progressiveInfoQueryKeys.detailById(id),
    queryFn: () => getProgressiveInfoById(id),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProgressiveInfo(id),
    onMutate: () => ({ id }),
    onSuccess: (_data, _params, context) => {
      queryClient.setQueriesData<Array<ProgressiveInfoResponseDto>>({ queryKey: progressiveInfoQueryKeys.lists() }, (old) =>
        old?.filter((item) => item.id !== id),
      );
      queryClient.getQueriesData<ProgressiveInfoResponseDto>({ queryKey: progressiveInfoQueryKeys.details() }).forEach(([key, value]) => {
        if (value?.id === context.id) queryClient.removeQueries({ queryKey: key, exact: true });
      });
      toast.success(`Commentaire du fil de l'eau supprimé`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression du commentaire du fil de l'eau");
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
          <p>Supprimer une information générale</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div className="delete_text">Vous etes sur le point de supprimer ce commentaire, voulez-vous continuez ?</div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Oui, je supprime
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
