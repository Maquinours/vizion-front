import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import styles from './ValidatePersonalTaskModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { validateTask } from './utils/api/personalTask';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import Page from '../../../../../../utils/types/Page';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { toast } from 'react-toastify';
import { getTaskById } from '../../../../../../utils/api/task';

const Route = getRouteApi('/app/dashboard/validate-personal-task/$taskId');

export default function AppViewDashboardViewValidatePersonalTaskModalView() {
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
    mutationFn: () => validateTask(task.id, user.profile.id),
    onSuccess: (data) => {
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: taskQueryKeys.details() }, (old) => (old?.id === data.id ? data : old));
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: taskQueryKeys.lists() }, (old) => old?.map((t) => (t.id === data.id ? data : t)));
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: taskQueryKeys.pages() }, (old) =>
        old ? { ...old, content: old.content.map((t) => (t.id === data.id ? data : t)) } : old,
      );
      toast.success(`Tâche validée avec succès`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la validation de la tâche personnelle');
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
          <p>Validation de la charge de travail</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div style={{ margin: '1rem 0' }}>
              <p>Vous êtes sur le point de valider cette tâche, voulez-vous continuer ?</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
