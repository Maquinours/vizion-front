import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../components/Quill/Quill';
import { queries } from '../../../../../../utils/constants/queryKeys';
import ProgressiveInfoResponseDto from '../../../../../../utils/types/ProgressiveInfoResponseDto';
import styles from './CreateProgressiveInfoModal.module.scss';
import { createProgressiveInfo } from './utils/api/progressiveInfo';

const Route = getRouteApi('/app/dashboard/create-progressive-info');

const yupSchema = yup.object({
  content: yup.string().required('Ce champ est requis'),
});

export default function AppViewDashboardViewCreateProgressiveInfoModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ content }: yup.InferType<typeof yupSchema>) => createProgressiveInfo({ content }),
    onSuccess: (progressiveInfo) => {
      queryClient.setQueriesData<Array<ProgressiveInfoResponseDto>>({ queryKey: queries['progressive-infos'].list.queryKey }, (old) =>
        old ? [progressiveInfo, ...old] : old,
      );
      toast.success(`Commentaire du fil de l'eau ajouté`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du commentaire");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Ajouter une information générale</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label className="label" htmlFor="information">
                Saisir votre information :
              </label>
              <Controller
                control={control}
                name="content"
                render={({ field: { value, onChange, onBlur } }) => <Quill value={value} onChange={onChange} onBlur={onBlur} />}
              />
              <p className={styles._errors}>{errors.content?.message}</p>
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
