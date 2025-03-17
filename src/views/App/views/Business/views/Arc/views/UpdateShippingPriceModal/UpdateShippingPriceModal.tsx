import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { updateBusinessArc } from '../../../../../../../../utils/api/businessArcs';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessArcResponseDto from '../../../../../../../../utils/types/BusinessArcResponseDto';
import styles from './UpdateShippingPriceModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc/update-shipping-price');

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
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ shippingServicePrice }: yup.InferType<typeof yupSchema>) => {
      const totalAmountHT = arc.arcDetailsList?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0;
      const total = totalAmountHT + shippingServicePrice;
      const vat = business.exportTva ? total * 0.2 : 0;
      const totalAmount = total + vat;

      return updateBusinessArc(arc.id, {
        number: arc.number,
        documentName: arc.documentName,
        shippingServicePrice,
        vat,
        numOrder: arc.numOrder,
        totalAmount,
        totalAmountHT,
        businessId: business.id,
        amountHtConfirmed: arc.amountHtConfirmed,
        shippingPriceConfirmed: arc.shippingPriceConfirmed,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs']._def });
      queryClient.setQueryData<BusinessArcResponseDto>(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey, data);
      toast.success('Frais de port mis à jour');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      let message = 'Une erreur est survenue lors de la mise à jour des frais de port';
      if (
        isAxiosError(error) &&
        !!error.response &&
        typeof error.response === 'object' &&
        'message' in error.response.data &&
        error.response?.data.message === 'Numéro de commande requis.'
      )
        message = 'Veuillez saisir un numéro de commande avant de modifier les frais de port';
      toast.error(message);
    },
  });

  useEffect(() => {
    setValue('shippingServicePrice', arc.shippingServicePrice);
  }, [arc.id]);

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
              <Controller
                control={control}
                name="shippingServicePrice"
                render={({ field: { value, onChange } }) => (
                  <CurrencyFormat value={value} onValueChange={(v) => onChange(v.value)} id="shippingServicePrice" displayType="input" />
                )}
              />

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
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
