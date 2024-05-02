import ReactModal from 'react-modal';
import styles from './CreateModal.module.scss';
import * as yup from 'yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductShelf } from '../../../../../../../../utils/api/productShelf';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/tools/product-shelves/create');

const yupSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  note: yup.string().required('La note est requise'),
});

export default function AppViewToolsViewProductShelvesViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, note }: yup.InferType<typeof yupSchema>) => createProductShelf({ number: name, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-shelves']._def });
      toast.success('Étagère créée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'étagère");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Création d&apos;étagère</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className="label" htmlFor="shelfName">
              Nom
            </label>
            <input id="shelfName" type="text" placeholder="..." {...register('name')} />
            <p className={styles.__errors}>{errors.name?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className="label" htmlFor="shelfNote">
              Note
            </label>
            <textarea id="shelfNote" rows={4} placeholder="..." {...register('note')} />
            <p className={styles.__errors}>{errors.note?.message}</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
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
