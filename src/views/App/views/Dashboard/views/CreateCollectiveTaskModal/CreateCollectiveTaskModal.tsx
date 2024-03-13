import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { createTask } from '../../../../../../utils/api/task';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import { PulseLoader } from 'react-spinners';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import { toast } from 'react-toastify';
import styles from './CreateCollectiveTaskModal.module.scss';

const Route = getRouteApi('/app/dashboard/create-collective-task');

const yupSchema = yup.object({
  content: yup.string().required('Le contenu est requis'),
});

export default function DashboardComponentCreateCollectiveTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      content: '',
    },
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ content }: yup.InferType<typeof yupSchema>) =>
      createTask({
        name: `${currentUser.profile.firstName ?? ''} ${currentUser.profile.lastName ?? ''}`,
        author: `${currentUser.profile.firstName ?? ''} ${currentUser.profile.lastName ?? ''}`,
        content,
        type: WorkloadType.COLLECTIVE,
        deadline: new Date(),
        senderId: currentUser.profile.id,
        enterpriseName: currentUser.profile.enterprise?.name,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<Array<TaskResponseDto>>(taskQueryKeys.listByType(WorkloadType.COLLECTIVE), (old) => [...(old ?? []), data]);
      toast.success('Charge de travail collective ajoutée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout de la charge de travail collective");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Ajouter une charge de travail collective</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label className="label" htmlFor="information">
                Quoi :
              </label>
              <textarea rows={8} {...register('content')} id="information" autoCorrect="true" autoComplete="no" />
              <p className={styles.__errors}>{errors.content?.message}</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
