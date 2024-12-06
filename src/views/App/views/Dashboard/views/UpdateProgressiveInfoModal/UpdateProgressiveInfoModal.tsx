import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../components/Quill/Quill';
import { queries } from '../../../../../../utils/constants/queryKeys';
import ProgressiveInfoResponseDto from '../../../../../../utils/types/ProgressiveInfoResponseDto';
import styles from './UpdateProgressiveInfoModal.module.scss';
import { updateProgressiveInfo } from './utils/api/progressiveInfo';

const routeApi = getRouteApi('/app/dashboard/update-progressive-info/$progressiveInfoId');

const yupSchema = yup.object({
  content: yup.string().required('Ce champ est requis'),
});

export default function AppViewDashboardViewUpdateProgressiveInfoModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { progressiveInfoId: id } = routeApi.useParams();

  const { data: progressiveInfo } = useSuspenseQuery(queries['progressive-infos'].detail(id));

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
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ content }: yup.InferType<typeof yupSchema>) => updateProgressiveInfo(id, { content }),
    onSuccess: (data) => {
      queryClient.setQueriesData<Array<ProgressiveInfoResponseDto>>({ queryKey: queries['progressive-infos'].list.queryKey }, (old) =>
        old?.map((item) => (item.id === data.id ? data : item)),
      );
      queryClient.setQueryData(queries['progressive-infos'].detail(data.id).queryKey, data);

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
