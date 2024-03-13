import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { AiOutlineSend } from 'react-icons/ai';
import * as yup from 'yup';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaskComment } from './utils/api/taskComments';
import { getRouteApi } from '@tanstack/react-router';
import TaskCommentResponseDto from '../../../../../../../../utils/types/TaskCommentResponseDto';
import { taskCommentsQueryKeys } from '../../../../../../../../utils/constants/queryKeys/taskComment';
import { toast } from 'react-toastify';
import styles from './Input.module.scss';
import { PulseLoader } from 'react-spinners';

const Route = getRouteApi('/app/dashboard/task-comments/$taskId');

const yupSchema = yup.object({
  comment: yup.string().required('Le contenu est requis'),
});

type AppViewDashboardViewTaskCommentsModalViewInputComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AppViewDashboardViewTaskCommentsModalViewInputComponent({ onClose }: AppViewDashboardViewTaskCommentsModalViewInputComponentProps) {
  const queryClient = useQueryClient();

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { taskId } = Route.useParams();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ comment }: yup.InferType<typeof yupSchema>) =>
      createTaskComment({
        author: currentUser.profile.firstName + ' ' + currentUser.profile.lastName,
        tasksId: taskId,
        comment: comment,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<Array<TaskCommentResponseDto>>(taskCommentsQueryKeys.listByTaskId(taskId), (old) => (old ? [...old, data] : old));
      toast.success('Commentaire envoyé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'envoi du commentaire");
    },
  });

  return (
    <div className={styles.new_comment}>
      <div className={styles.send_comment}>
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <textarea {...register('comment')} rows={2} id="comment" autoCorrect="true" autoComplete="no" />
          <button type="submit">
            <AiOutlineSend />
          </button>
        </form>
      </div>
      <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
    </div>
  );
}
