import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { updatePredefinedMessage } from '../../../../../../../../utils/api/predefinedMessage';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-messages/update/$predefinedMessageId');

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  content: yup.string().required('La description est requise'),
});

export default function AppViewToolsViewPredefinedMessagesViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { predefinedMessageId } = routeApi.useParams();

  const { data: predefinedMessage } = useSuspenseQuery(queries['predefined-message'].detail(predefinedMessageId));

  const { register, control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      title: predefinedMessage.title,
      content: predefinedMessage.description,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, content }: yup.InferType<typeof yupSchema>) => updatePredefinedMessage(predefinedMessage.id, { title, description: content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['predefined-message']._def });
      toast.success('Message prédéfini modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du message prédéfini');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Modification du message prédéfini <span style={{ color: 'var(--secondary-color)' }}>{predefinedMessage.title}</span>
          </h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.modal_content}>
            <div className={styles.title_container}>
              <label htmlFor="title">Titre :</label>
              <input type="text" id="messageTitle" placeholder={predefinedMessage.title} {...register('title')} />
            </div>
            <div className={styles.editor}>
              <label htmlFor="description">Description :</label>
              <Controller
                control={control}
                name="content"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Quill placeholder={predefinedMessage.description} value={value} onChange={onChange} onBlur={onBlur} />
                )}
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
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
