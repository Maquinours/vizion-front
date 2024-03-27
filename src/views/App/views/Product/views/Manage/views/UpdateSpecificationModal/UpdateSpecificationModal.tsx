import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { productSpecificationQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSpecification';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { getProductSpecificationById, updateProductSpecification } from '../../../../../../../../utils/api/productSpecification';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import styles from './UpdateSpecificationModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/update-specification/$specificationId');

const yupSchema = yup.object({
  value: yup
    .number()
    .typeError('Veuillez entrer un nombre')
    .when(['maxValue', 'minValue'], ([minValue, maxValue], schema) => {
      return maxValue === null && maxValue === undefined && minValue === null && minValue === undefined
        ? schema.required('La valeur fixe ou les valeurs maximal et minimal sont requises')
        : schema.nullable();
    }),
  minValue: yup
    .number()
    .typeError('Veuillez entrer un nombre')
    .when('maxValue', ([maxValue], schema) => {
      return maxValue !== null && maxValue !== undefined
        ? schema
            .required('La valeur maximale est requise si la valeur minimale est renseignée')
            .lessThan(maxValue, 'La valeur minimale doit être inférieure à la valeur maximale')
        : schema.nullable();
    }),
  maxValue: yup.number().typeError('Veuillez entrer un nombre'),
});

export default function AppViewProductViewManageViewUpdateSpecificationModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId, specificationId } = routeApi.useParams();

  const { data: productSpec } = useSuspenseQuery({
    queryKey: productSpecificationQueryKeys.detailById(productId, specificationId),
    queryFn: () => getProductSpecificationById(productId, specificationId),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      value: productSpec.value ?? undefined,
      minValue: productSpec.minValue ?? undefined,
      maxValue: productSpec.maxValue ?? undefined,
    },
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ value, minValue, maxValue }: yup.InferType<typeof yupSchema>) =>
      updateProductSpecification(productId, specificationId, value ?? null, minValue ?? null, maxValue ?? null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSpecificationQueryKeys.all });
      toast.success('Spécification modifiée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification de la spécification');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.value_modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Modifier la valeur du filtre <span style={{ color: 'var(--secondary-color)' }}>{productSpec.specification?.name}</span>
          </h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="value">
              Valeur :
            </label>
            <input placeholder="..." type="number" step="any" {...register('value')} />
            <p className={styles.__errors}>{errors.value?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="minValue">
              Min :
            </label>
            <input placeholder="..." type="number" step="any" {...register('minValue')} />
            <p className={styles.__errors}>{errors.minValue?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="maxValue">
              Max :
            </label>
            <input placeholder="..." type="number" step="any" {...register('maxValue')} />
            <p className={styles.__errors}>{errors.maxValue?.message}</p>
          </div>
          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>
          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
