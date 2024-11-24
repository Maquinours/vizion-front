import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { updatePredefinedText } from '../../../../../../../../utils/api/predefinedText';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-texts/update/$predefinedTextId');

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  description: yup.string().required('La description est requise'),
  orderNum: yup.number().required("L'ordre est requis"),
});
export default function AppViewToolsViewPredefinedTextsViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { predefinedTextId: id } = routeApi.useParams();

  const { data: text } = useSuspenseQuery(queries['predefined-text'].detail(id));

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      title: text.title,
      orderNum: text.orderNum,
      description: text.description,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, orderNum, description }: yup.InferType<typeof yupSchema>) => updatePredefinedText(id, { title, orderNum, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['predefined-text']._def });
      toast.success('Texte prédéfini modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du texte prédéfini');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Modification du texte prédéfini <span style={{ color: 'var(--secondary-color)' }}>{text.title}</span>
          </h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.modal_content}>
            <div className={styles.title_container}>
              <label htmlFor="title">Titre :</label>
              <input type="text" id="title" {...register('title')} />
            </div>
            <div className={styles.title_container}>
              <label className="label" htmlFor="textOrder">
                Ordre
              </label>
              <input id="textOrder" type="number" {...register('orderNum')} />
              <p className="__errors">{errors.orderNum?.message}</p>
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
