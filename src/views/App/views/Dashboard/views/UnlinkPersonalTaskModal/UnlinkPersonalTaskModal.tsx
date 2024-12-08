import { getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UnlinkPersonalTaskModal.module.scss';
import { PulseLoader } from 'react-spinners';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { updateTask } from '../../../../../../utils/api/task';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/dashboard/unlink-personal-task/$taskId');

export default function AppViewDashboardViewUnlinkPersonalTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateTask(task.id, task.profileId!, task.state!, {
        type: WorkloadType.PERSONELLE,
        content: task.content ?? '',
        name: task.name,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        profileId: task.profileId,
        senderId: task.senderId,
        mailId: task.mailId,
        mailHashId: task.mailHashId,
        receiver: task.receiver,
        businessId: null,
        businessNum: null,
        businessName: null,
        productId: null,
        reference: null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.tasks._def });
      toast.success('Liaison de tâche supprimée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression de la liaison de la tâche');
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
          <p>Suppression de la liaison de la charge personnelle</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <p>{'Vous êtes sur le point de supprimer la liaison de la charge actuelle, voulez-vous continuez ?'}</p>
            </div>
            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
