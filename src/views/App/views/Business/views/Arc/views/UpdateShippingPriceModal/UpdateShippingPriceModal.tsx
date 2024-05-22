import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import styles from './UpdateShippingPriceModal.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { updateBusinessArc } from '../../../../../../../../utils/api/businessArcs';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessArcResponseDto from '../../../../../../../../utils/types/BusinessArcResponseDto';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc/update-shipping-price');

const yupSchema = yup.object({
  shippingServicePrice: yup
    .number()
    .transform((_value, originalValue) => (typeof originalValue === 'string' ? Number(originalValue.replace(/,/, '.')) : originalValue))
    .typeError('Format invalide')
    .min(0, 'Min 0')
    .required('Les frais de ports sont requis.'),
});

export default function AppViewBusinessViewArcViewUpdateShippingPriceModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      shippingServicePrice: arc.shippingServicePrice,
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ shippingServicePrice }: yup.InferType<typeof yupSchema>) =>
      updateBusinessArc(arc.id, {
        number: arc.number,
        documentName: arc.documentName,
        shippingServicePrice,
        vat: arc.vat,
        numOrder: arc.numOrder,
        totalAmount: arc.totalAmount,
        totalAmountHT: arc.totalAmountHT,
        businessId: business.id,
        amountHtConfirmed: arc.amountHtConfirmed,
        shippingPriceConfirmed: arc.shippingPriceConfirmed,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs']._def });
      queryClient.setQueryData<BusinessArcResponseDto>(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey, data);
      toast.success('Frais de port mis à jour');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour des frais de port');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Frais de port</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="shippingServicePrice">Frais de port</label>
              <input id="shippingServicePrice" type="number" {...register('shippingServicePrice')} />
              <p className={styles.__errors}>{errors.shippingServicePrice?.message}</p>
            </div>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
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
