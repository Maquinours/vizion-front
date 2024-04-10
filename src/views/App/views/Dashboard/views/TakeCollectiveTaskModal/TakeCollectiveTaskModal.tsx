import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { attributeTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './TakeCollectiveTaskModal.module.scss';

const Route = getRouteApi('/app/dashboard/take-collective-task/$taskId');

export default function AppViewDashboardViewTakeCollectiveTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => attributeTask(task.id, currentUser.profile.id, task.senderId && !task.mailId ? task.senderId : currentUser.profile.id, false),
    onSuccess: (data) => {
      queryClient.setQueryData<Array<TaskResponseDto>>(queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE).queryKey, (old) =>
        old?.filter((t) => t.id !== data.id),
      );
      // TODO: set to personal task
      toast.success('Charge de travail prise en charge avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la prise en charge de la charge de travail collective');
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
          <p>Attribution de la charge collective</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{task.content}</p>
              <p>Vous êtes sur le point de prendre la charge actuelle, voulez-vous continuez ?</p>
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
