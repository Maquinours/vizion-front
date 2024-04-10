import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { createPredefinedMessage } from '../../../../../../../../utils/api/predefinedMessage';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './CreateModal.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-messages/create');

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  content: yup.string().required('La description est requise'),
});

export default function AppViewToolsViewPredefinedMessagesViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { register, control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, content }: yup.InferType<typeof yupSchema>) => createPredefinedMessage({ title, description: content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['predefined-message']._def });
      toast.success('Message prédéfini ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du message prédéfini");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un message prédéfini</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.modal_content}>
            <div className={styles.title_container}>
              <label htmlFor="title">Titre :</label>
              <input type="text" id="messageTitle" {...register('title')} />
            </div>
            <div className={styles.editor}>
              <label htmlFor="description">Description :</label>
              <Controller
                control={control}
                name="content"
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
