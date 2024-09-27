import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateProductSpecification } from '../../../../../../../../utils/api/productSpecification';
import { productSpecificationsQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSpecifications';
import styles from './UpdateSpecificationModal.module.scss';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';

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
            .min(maxValue, 'La valeur minimale doit être inférieure ou égale à la valeur maximale')
        : schema.nullable();
    }),
  maxValue: yup.number().typeError('Veuillez entrer un nombre'),
});

export default function AppViewProductViewManageViewUpdateSpecificationModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId, specificationId } = routeApi.useParams();

  const { data: productSpec } = useSuspenseQuery(productSpecificationsQueryKeys.detail._ctx.byId({ productId, specificationId }));

  const {
    control,
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
    navigate({ from: routeApi.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ value, minValue, maxValue }: yup.InferType<typeof yupSchema>) =>
      updateProductSpecification(productId, specificationId, value ?? null, minValue ?? null, maxValue ?? null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSpecificationsQueryKeys._def });
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
            <Controller
              control={control}
              name="value"
              render={({ field: { value, onChange } }) => (
                <AmountFormat value={value} suffix={productSpec.specification?.unit ?? undefined} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className={styles.__errors}>{errors.value?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="minValue">
              Min :
            </label>
            <Controller
              control={control}
              name="minValue"
              render={({ field: { value, onChange } }) => (
                <AmountFormat value={value} suffix={productSpec.specification?.unit ?? undefined} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className={styles.__errors}>{errors.minValue?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="maxValue">
              Max :
            </label>
            <Controller
              control={control}
              name="maxValue"
              render={({ field: { value, onChange } }) => (
                <AmountFormat value={value} suffix={productSpec.specification?.unit ?? undefined} onValueChange={(v) => onChange(v.value)} />
              )}
            />
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
