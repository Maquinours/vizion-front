import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { createPredefinedText } from '../../../../../../../../utils/api/predefinedText';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './CreateModal.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-texts');

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  description: yup.string().required('La description est requise'),
  orderNum: yup.number().typeError('Un nombre est requis').required("L'ordre est requis"),
});

export default function AppViewToolsViewPredefinedTextsViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, orderNum }: yup.InferType<typeof yupSchema>) => createPredefinedText({ title, description, orderNum }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['predefined-text']._def });
      toast.success('Texte prédéfini ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de l'ajout du texte prédéfini");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un texte prédéfini</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.modal_content}>
            <div className={styles.title_container}>
              <label htmlFor="title">Titre :</label>
              <input type="text" id="title" {...register('title')} />
            </div>
            <div className={styles.title_container}>
              <label className="label" htmlFor="textOrder">
                Ordre :
              </label>
              <input id="textOrder" type="number" {...register('orderNum')} />
              <p>{errors.orderNum?.message}</p>
            </div>
            <div className={styles.editor}>
              <label htmlFor="description">Description :</label>
              <Controller
                control={control}
                name="description"
                render={({ field: { value, onChange, onBlur } }) => <Quill value={value} onChange={onChange} onBlur={onBlur} />}
              />
            </div>
          </div>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
