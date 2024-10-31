import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateProductFilter } from '../../../../../../../../utils/api/productFilter';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/tools/product-filters/update/$productFilterId');

const yupSchema = yup.object().shape({
  name: yup.string().required('Champs requis'),
  type: yup.string().required('Champs requis'),
  unit: yup.string().required('Champs requis'),
  comment: yup.string().required('Champs requis'),
});

export default function AppViewToolsViewProductFiltersViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { productFilterId } = routeApi.useParams();

  const { data: productFilter } = useSuspenseQuery(queries['product-filter'].detail._ctx.byId(productFilterId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: productFilter.name ?? '',
      type: productFilter.type ?? '',
      unit: productFilter.unit ?? '',
      comment: productFilter.comment ?? '',
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, type, unit, comment }: yup.InferType<typeof yupSchema>) => updateProductFilter(productFilter.id, { name, type, unit, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-filter']._def });
      toast.success('Filtre modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du filtre');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Modification du filtre <span style={{ color: 'var(--secondary-color)' }}>{productFilter.name}</span>
          </h6>
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
            <textarea id="filterNote" rows={4} placeholder="..." {...register('comment')} />
            <p className={styles.__errors}>{errors.comment?.message}</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
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
