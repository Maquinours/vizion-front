import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { updateTask } from '../../utils/api/task';
import { queries } from '../../utils/constants/queryKeys';
import TaskRequestDto from '../../utils/types/TaskRequestDto';
import styles from './UnlinkWorkloadModal.module.scss';

type UnlinkWorkloadModalComponentProps = Readonly<{
  taskId: string;
  onClose: () => void;
}>;
export default function UnlinkWorkloadModalComponent({ taskId, onClose }: UnlinkWorkloadModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const content: TaskRequestDto = {
        type: task.type!,
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
        rmaId: null,
        rmaNum: null,
        productId: null,
        reference: null,
        enterpriseId: null,
        enterpriseName: null,
      };
      return updateTask(task.id, task.profileId!, task.state!, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.tasks._def });
      toast.success('Tâche liée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la liaison de la tâche');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Dissociation d'un document</h6>
        </div>

        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Vous êtes sur le point de dissocier un document d'un élément.</p>
            <p>Voulez-vous continuer ?</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Dissocier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
