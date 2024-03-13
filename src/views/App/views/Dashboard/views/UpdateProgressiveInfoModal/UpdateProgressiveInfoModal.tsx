import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import * as yup from 'yup';
import Quill from '../../../../../../components/Quill/Quill';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { progressiveInfoQueryKeys } from '../../../../../../utils/constants/queryKeys/progressiveInfo';
import { getProgressiveInfoById } from '../../../../../../utils/api/progressiveInfo';
import { updateProgressiveInfo } from './utils/api/progressiveInfo';
import ProgressiveInfoResponseDto from '../../../../../../utils/types/ProgressiveInfoResponseDto';
import { toast } from 'react-toastify';
import styles from './UpdateProgressiveInfoModal.module.scss';

const Route = getRouteApi('/app/dashboard/update-progressive-info/$progressiveInfoId');

const yupSchema = yup.object({
  content: yup.string().required('Ce champ est requis'),
});

export default function AppViewDashboardViewUpdateProgressiveInfoModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { progressiveInfoId: id } = Route.useParams();

  const { data: progressiveInfo } = useSuspenseQuery({
    queryKey: progressiveInfoQueryKeys.detailById(id),
    queryFn: () => getProgressiveInfoById(id),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      content: progressiveInfo.content ?? '',
    },
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ content }: yup.InferType<typeof yupSchema>) => updateProgressiveInfo(id, { content }),
    onSuccess: (data) => {
      queryClient.setQueriesData<Array<ProgressiveInfoResponseDto>>({ queryKey: progressiveInfoQueryKeys.lists() }, (old) =>
        old?.map((item) => (item.id === data.id ? data : item)),
      );
      queryClient.setQueriesData<ProgressiveInfoResponseDto>({ queryKey: progressiveInfoQueryKeys.details() }, (old) => (old?.id === data.id ? data : old));

      toast.success(`Commentaire du fil de l'eau modifié`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification du commentaire du fil de l'eau");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Modifier une information générale</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <Controller
                control={control}
                name="content"
                render={({ field: { value, onChange, onBlur } }) => <Quill value={value} onChange={onChange} onBlur={onBlur} />}
              />
              <p className={styles._errors}>{errors.content?.message}</p>
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
