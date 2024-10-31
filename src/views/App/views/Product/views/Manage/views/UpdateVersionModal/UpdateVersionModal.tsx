import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { updateProductVersion } from '../../../../../../../../utils/api/productVersion';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateVersionModal.module.scss';

const routeApi = getRouteApi('/app/products_/$productId/manage/update-version/$versionId');

export default function AppViewProductViewManageViewUpdateVersionModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { productId, versionId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  const { data: version } = useSuspenseQuery(queries['product-versions'].detail._ctx.byId(versionId));

  const yupSchema = yup.object().shape({
    reference: yup
      .string()
      .notOneOf(product.productVersions?.filter((ver) => ver.id !== version.id).map((version) => version.reference) ?? [], 'Cette référence existe déjà.')
      .required('La référence est requise.'),
    purchasePrice: yup.number().typeError('Veuillez entrer un nombre').nullable(),
    costPrice: yup.number().typeError('Veuillez entrer un nombre').min(0, 'Min 0').required('Le prix de reviens est requis.'),
    margin: yup.number().typeError('Veuillez entrer un nombre').min(0, 'Min 0').max(100, 'Max 100').required('La marge est requise'),
    portOrService: yup.number().typeError('Veuillez entrer un nombre').nullable(),
    tax: yup.number().typeError('Veuillez entrer un nombre').nullable(),
    price: yup.number().typeError('Veuillez entrer un nombre').min(1, 'Min 1').required('Le prix est requis.'),
    ecoTax: yup.number().typeError('Veuillez entrer un nombre').nullable(),
  });

  const {
    register,
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
    resetField,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      reference: version.reference ?? '',
      purchasePrice: version.purchasePriceUSD,
      costPrice: version.purchasePriceEUR ?? 0,
      margin: version.margin ?? 0,
      portOrService: version.shippingService,
      tax: version.customsTax,
      price: version.publicPrice ?? 0,
      ecoTax: version.ecoTaxDEEE,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ reference, purchasePrice, costPrice, margin, portOrService, tax, price, ecoTax }: yup.InferType<typeof yupSchema>) =>
      updateProductVersion(product.id, {
        reference: reference,
        providerId: version.providerId,
        providerName: version.providerName,
        purchasePriceUSD: purchasePrice,
        purchasePriceEUR: costPrice,
        shippingService: portOrService,
        margin: margin,
        customsTax: tax,
        ecoTaxDEEE: ecoTax,
        publicPrice: price,
        productId: version.product?.id ?? product.id,
        productReference: version.product?.reference ?? product.reference,
        virtualQty: version.virtualQty,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-versions']._def });
      toast.success('La version a été modifiée avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification de la version.');
    },
  });

  useEffect(() => {
    const costPrice = Number(getValues('costPrice')) || 0;
    const shippingService = Number(getValues('portOrService')) || 0;
    const tax = Number(getValues('tax')) || 0;
    const price = Number(getValues('price')) || 0;

    const margin = Math.round((1 - (costPrice + shippingService + tax) / price) * 100);
    if (!isNaN(margin) && isFinite(margin)) setValue('margin', margin);
    else resetField('margin');
  }, [watch('costPrice'), watch('portOrService'), watch('tax'), watch('price')]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modifier la version</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_group}>
              <label htmlFor="productVersionReference" className={styles.required}>
                <span>*</span>Référence version :
              </label>
              <input id="productVersionReference" placeholder="Référence version" {...register('reference')} />
              <p className={styles.errors}>{errors.reference?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productPurchasePrice">Tarif achat en $ :</label>
              <Controller
                control={control}
                name="purchasePrice"
                render={({ field: { value, onChange } }) => (
                  <AmountFormat
                    id="productPurchasePrice"
                    displayType="input"
                    value={value}
                    suffix=" $"
                    decimalScale={2}
                    onValueChange={(v) => onChange(v.value)}
                  />
                )}
              />
              <p className={styles.errors}>{errors.purchasePrice?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productCostPrice" className={styles.required}>
                <span>*</span>Prix revient en € :
              </label>
              <Controller
                control={control}
                name="costPrice"
                render={({ field: { value, onChange } }) => (
                  <CurrencyFormat id="productCostPrice" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                )}
              />
              <p className={styles.errors}>{errors.costPrice?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productMargin">Marge :</label>
              <Controller
                control={control}
                name="margin"
                render={({ field: { value } }) => (
                  <AmountFormat id="productMargin" displayType="input" allowNegative placeholder="0.00 %" suffix="%" decimalScale={2} value={value} readOnly />
                )}
              />
              <p className={styles.errors}>{errors.margin?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productPortOrService">Port / Service :</label>
              <Controller
                control={control}
                name="portOrService"
                render={({ field: { value, onChange } }) => (
                  <CurrencyFormat id="productPortOrService" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                )}
              />
              <p className={styles.errors}>{errors.portOrService?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productTax">Taxe / Douane :</label>
              <Controller
                control={control}
                name="tax"
                render={({ field: { value, onChange } }) => (
                  <CurrencyFormat id="productTax" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                )}
              />
              <p className={styles.errors}>{errors.tax?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productPrice" className={styles.required}>
                <span>*</span>Prix public :
              </label>
              <Controller
                control={control}
                name="price"
                render={({ field: { value, onChange } }) => (
                  <CurrencyFormat id="productPrice" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                )}
              />
              <p className={styles.errors}>{errors.price?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productEcoTax">Ecotaxe DEEE :</label>
              <Controller
                control={control}
                name="ecoTax"
                render={({ field: { value, onChange } }) => (
                  <CurrencyFormat id="productEcoTax" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                )}
              />
              <p className={styles.errors}>{errors.ecoTax?.message}</p>
            </div>

            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.modal_footer}>
              <button className="btn btn-primary" type="reset">
                Annuler
              </button>
              <button className="btn btn-secondary" type="submit">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
