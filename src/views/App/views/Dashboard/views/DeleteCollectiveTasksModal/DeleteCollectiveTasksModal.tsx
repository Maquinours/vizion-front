import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { queries } from '../../../../../../utils/constants/queryKeys';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import styles from './DeleteCollectiveTasksModal.module.scss';
import { deleteTasks } from './utils/api/collectiveTasks';

const routeApi = getRouteApi('/app/dashboard/delete-collective-tasks');

export default function AppViewDashboardViewDeleteCollectiveTasksModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { tasksId } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTasks(tasksId),
    onMutate: () => ({ tasksId }),
    onSuccess: (_data, _params, context) => {
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: queries.tasks.list.queryKey }, (old) =>
        old?.filter((task) => !context.tasksId.includes(task.id)),
      );
      queryClient.getQueriesData<TaskResponseDto>({ queryKey: queries.tasks.detail._def }).forEach(([key, value]) => {
        if (value && context.tasksId.includes(value.id)) queryClient.removeQueries({ queryKey: key, exact: true });
      });
      toast.success('Charges de travail collectives supprimées avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression des charges de travail collectives');
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
          <p>Suppression de charges collectives</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <p>Vous êtes sur le point de supprimer les charges selectionnées, voulez-vous continuez ?</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button disabled={isPending} type="submit" className="btn btn-secondary">
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
