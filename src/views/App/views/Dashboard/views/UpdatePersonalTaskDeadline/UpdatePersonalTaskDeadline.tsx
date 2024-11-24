import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { queries } from '../../../../../../utils/constants/queryKeys';
import Page from '../../../../../../utils/types/Page';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import styles from './UpdatePersonalTaskDeadline.module.scss';
import { updateTaskDeadline } from './utils/api/personalTask';

const yupSchema = yup.object({
  deadline: yup.date().required('La date est requise'),
});

const Route = getRouteApi('/app/dashboard/update-personal-task-deadline/$taskId');

export default function AppViewDashboardViewUpdatePersonalTaskDeadline() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      deadline: task.deadline && new Date(task.deadline) > new Date() ? new Date(task.deadline) : new Date(),
    },
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ deadline }: yup.InferType<typeof yupSchema>) => updateTaskDeadline(task.id, deadline),
    onSuccess: (data) => {
      toast.success(`Tâche repoussée avec succès`);
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: queries.tasks.detail._def }, (old) => (old?.id === data.id ? data : old));
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: queries.tasks.list.queryKey }, (old) => old?.map((t) => (t.id === data.id ? data : t)));
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: queries.tasks.page.queryKey }, (old) =>
        old ? { ...old, content: old.content.map((t) => (t.id === data.id ? data : t)) } : old,
      );
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors du repoussement de la tâche personnelle');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Repousser la date de fin</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label className="label" htmlFor="information">
                Quand :
              </label>
              <input type="date" {...register('deadline')} id="date" />
              <p className={styles.errors}>{errors.deadline?.message}</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
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
