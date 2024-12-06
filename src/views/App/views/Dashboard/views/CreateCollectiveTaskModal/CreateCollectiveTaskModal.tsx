import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './CreateCollectiveTaskModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/create-collective-task');

const yupSchema = yup.object({
  content: yup.string().required('Le contenu est requis'),
});

export default function DashboardComponentCreateCollectiveTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

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
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
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
      queryClient.setQueryData<Array<TaskResponseDto>>(queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE).queryKey, (old) => [...(old ?? []), data]);
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
