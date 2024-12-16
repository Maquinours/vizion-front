import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { updateTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import TaskState from '../../../../../../utils/enums/TaskState';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './ArchivePersonalTaskModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/archive-personal-task/$taskId');

export default function AppViewDashboardViewArchivePersonalTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateTask(taskId, user.profile.id, TaskState.ARCHIVED, {
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        content: task.content!,
        type: task.type!,
      }),
    onSuccess: () => {
      toast.success(`Tâche personnelle archivée avec succès`);
      queryClient.invalidateQueries({ queryKey: queries.tasks._def });
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'archivage de la tâche personnelle");
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
          <p>Archivage de la charge personnelle</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <p>{"Vous êtes sur le point d'archiver la charge actuelle, voulez-vous continuez ?"}</p>
            </div>
            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Archiver
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
