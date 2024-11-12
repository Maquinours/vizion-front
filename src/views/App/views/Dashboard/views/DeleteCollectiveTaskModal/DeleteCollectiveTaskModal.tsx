import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import Modal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { queries } from '../../../../../../utils/constants/queryKeys';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import styles from './DeleteCollectiveTaskModal.module.scss';
import { deleteTask } from './utils/api/task';

const Route = getRouteApi('/app/dashboard/delete-collective-task/$taskId');

export default function AppViewDashboardViewDeleteCollectiveTaskModal() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTask(task),
    onMutate: () => ({ task }),
    onSuccess: (_data, _params, context) => {
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: queries.tasks.list.queryKey }, (old) => old?.filter((t) => t.id !== context.task.id));
      queryClient.getQueriesData<TaskResponseDto>({ queryKey: queries.tasks.detail._def }).forEach(([key, value]) => {
        if (value?.id === context.task.id) queryClient.removeQueries({ queryKey: key, exact: true });
      });
      toast.success('Charge de travail collective supprimée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression de la charge de travail collective');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Modal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Suppression de la charge collective</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{task.content}</p>
              <p>Vous êtes sur le point de supprimer la charge actuelle, voulez-vous continuez ?</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
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
    </Modal>
  );
}
