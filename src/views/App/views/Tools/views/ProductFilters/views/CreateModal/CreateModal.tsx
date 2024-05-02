import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './CreateModal.module.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PulseLoader } from 'react-spinners';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductFilter } from '../../../../../../../../utils/api/productFilter';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/tools/product-filters/create');

const yupSchema = yup.object().shape({
  name: yup.string().required('Champs requis'),
  type: yup.string().required('Champs requis'),
  unit: yup.string().required('Champs requis'),
  note: yup.string().required('Champs requis'),
});

export default function AppViewToolsViewProductFiltersViewCreateModalView() {
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
    mutationFn: ({ name, type, unit, note }: yup.InferType<typeof yupSchema>) => createProductFilter({ name, type, unit, comment: note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-filter']._def });
      toast.success('Filtre créé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du filtre');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Création d&apos;un filtre</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className="label" htmlFor="filterName">
              Nom
            </label>
            <input id="filterName" type="text" placeholder="..." {...register('name')} />
            <p className={styles.__errors}>{errors.name?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className="label" htmlFor="filterType">
              Description
            </label>
            <input id="filterType" type="text" placeholder="..." {...register('type')} />
            <p className={styles.__errors}>{errors.type?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className="label" htmlFor="shelfName">
              Unité
            </label>
            <input id="filterUnit" type="text" placeholder="..." {...register('unit')} />
            <p className={styles.__errors}>{errors.unit?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className="label" htmlFor="filterNote">
              Note
            </label>
            <textarea id="filterNote" rows={4} placeholder="..." {...register('note')} />
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
