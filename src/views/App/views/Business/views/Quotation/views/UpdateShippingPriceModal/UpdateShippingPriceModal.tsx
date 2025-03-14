import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { updateBusinessQuotation } from '../../../../../../../../utils/api/businessQuotations';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateShippingPriceModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/update-shipping-price');

const yupSchema = yup.object({
  shippingServicePrice: yup
    .number()
    .transform((_value, originalValue) => (typeof originalValue === 'string' ? Number(originalValue.replace(/,/, '.')) : originalValue))
    .typeError('Format invalide')
    .min(0, 'Min 0')
    .required('Les frais de ports sont requis.'),
});

export default function AppViewBusinessViewQuotationViewUpdateShippingPriceModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ shippingServicePrice }: yup.InferType<typeof yupSchema>) => {
      const totalAmountHT = quotation.totalAmountHT ?? 0;
      const total = totalAmountHT + shippingServicePrice;
      const vat = business.exportTva ? total * 0.2 : 0;
      const totalAmount = total + vat;
      return updateBusinessQuotation(quotation.id, {
        businessId: businessId,
        number: quotation.number,
        documentName: quotation.documentName,
        shippingServicePrice,
        vat,
        totalAmount,
        totalAmountHT,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Frais de port mis à jour');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour des frais de port');
    },
  });

  useEffect(() => {
    setValue('shippingServicePrice', quotation.shippingServicePrice);
  }, [quotation.id]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Frais de port</h6>
        </div>
        <form>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="shippingServicePrice">Frais de port</label>
              <Controller
                control={control}
                name="shippingServicePrice"
                render={({ field: { value, onChange } }) => <CurrencyFormat value={value} onValueChange={(v) => onChange(v.value)} displayType="input" />}
              />
              <p className={styles.__errors}>{errors.shippingServicePrice?.message}</p>
            </div>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))}>
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
