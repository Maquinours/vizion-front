import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import styles from './ArchivePersonalTaskModal.module.scss';
import { getTaskById, updateTask } from '../../../../../../utils/api/task';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import TaskState from '../../../../../../utils/enums/TaskState';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { toast } from 'react-toastify';

const Route = getRouteApi('/app/dashboard/archive-personal-task/$taskId');

export default function AppViewDashboardViewArchivePersonalTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
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
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
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
