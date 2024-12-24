import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import * as yup from 'yup';
import styles from './StepTwo.module.scss';
import CardComponent from '../../../Card/Card';
import CurrencyFormat from '../../../CurrencyFormat/CurrencyFormat';
import AmountFormat from '../../../AmountFormat/AmountFormat';

const assistanceHours = [
  {
    value: '',
    text: 'Choisir une heure',
  },
  ...Array.from({ length: 10 }, (_, i) => {
    const value = (i + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 });
    return { value, text: value };
  }),
  {
    value: 'More',
    text: 'Plus de 10',
  },
];

const yupSchema = yup.object().shape({
  purchasePrice: yup.number().typeError('Ce champs doit contenir un nombre').nullable(),
  costPrice: yup.number().typeError('Ce champs doit contenir un nombre').required('Le prix de reviens est requis.'),
  margin: yup.number().typeError('La marge doit être un nombre').min(0, 'Min 0').max(100, 'Max 100').required('La marge est requise'),
  shippingService: yup.number().typeError('Ce champs doit contenir un nombre').nullable(),
  tax: yup.number().typeError('Ce champs doit contenir un nombre').nullable(),
  price: yup.number().typeError('Ce champs doit contenir un nombre').min(1, 'Min 1').required('Le prix est requis.'),
  ecoTax: yup.number().typeError('Ce champs doit contenir un nombre').nullable(),
  assistanceHour: yup.string().nullable(),
  assistanceHourMore: yup
    .number()
    .typeError('Ce champs doit contenir un nombre')
    .nullable()
    .when('productAssistanceHour', {
      is: 'More',
      then: () => yup.number().typeError('Ce champs doit contenir un nombre').min(11, 'Min 11').required('Champs requis'),
    }),
});

export type CreateProductStepTwoType = yup.InferType<typeof yupSchema>;

type CreateProductModalComponentStepTwoComponentProps = Readonly<{
  show: boolean;
  goToPreviousStep: () => void;
  onSubmit: (data: CreateProductStepTwoType) => void;
  isPending: boolean;
}>;
export default function CreateProductModalComponentStepTwoComponent({
  show,
  goToPreviousStep,
  onSubmit,
  isPending,
}: CreateProductModalComponentStepTwoComponentProps) {
  const {
    register,
    control,
    setValue,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const costPriceWatch = useWatch({ name: 'costPrice', control });
  const shippingServiceWatch = useWatch({ name: 'shippingService', control });
  const taxWatch = useWatch({ name: 'tax', control });
  const priceWatch = useWatch({ name: 'price', control });
  const assistanceHour = useWatch({ name: 'assistanceHour', control });

  const showMoreHours = assistanceHour === 'More';

  useEffect(() => {
    const costPrice = Number(costPriceWatch) || 0;
    const shippingService = Number(shippingServiceWatch) || 0;
    const tax = Number(taxWatch) || 0;
    const price = Number(priceWatch) || 0;

    const margin = Math.round((1 - (costPrice + shippingService + tax) / price) * 100);
    if (!isNaN(margin) && isFinite(margin)) setValue('margin', margin);
    else resetField('margin');
  }, [costPriceWatch, shippingServiceWatch, taxWatch, priceWatch]);

  if (show)
    return (
      <div className={styles.card_container}>
        <CardComponent title="Informations générales">
          <div className={styles.form_container}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor="productPurchasePrice">Tarif achat en $ :</label>
                <Controller
                  control={control}
                  name="purchasePrice"
                  render={({ field: { value, onChange } }) => (
                    <CurrencyFormat
                      id="productPurchasePrice"
                      placeholder="0.00 $"
                      displayType="input"
                      currency="$"
                      value={value}
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
                    <CurrencyFormat id="productCostPrice" placeholder="0.00 €" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                  )}
                />
                <p className={styles.errors}>{errors.costPrice?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productMargin">Marge :</label>
                <Controller
                  control={control}
                  name="margin"
                  render={({ field: { value, onChange } }) => (
                    <AmountFormat
                      id="productMargin"
                      suffix="%"
                      allowNegative
                      placeholder="0.00 %"
                      displayType="input"
                      decimalScale={2}
                      value={value}
                      onValueChange={(v) => onChange(v.value)}
                      readOnly
                    />
                  )}
                />
                <p className={styles.errors}>{errors.margin?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productPortOrService">Port / Service :</label>
                <Controller
                  control={control}
                  name="shippingService"
                  render={({ field: { value, onChange } }) => (
                    <CurrencyFormat id="productPortOrService" placeholder="0.00 €" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                  )}
                />
                <p className={styles.errors}>{errors.shippingService?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productTax">Taxe / Douane :</label>
                <Controller
                  control={control}
                  name="tax"
                  render={({ field: { value, onChange } }) => (
                    <CurrencyFormat id="productTax" placeholder="0.00 €" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
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
                    <CurrencyFormat id="productPrice" placeholder="0.00 €" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
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
                    <CurrencyFormat id="productEcoTax" placeholder="0.00 €" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
                  )}
                />
                <p className={styles.errors}>{errors.ecoTax?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productAssistanceHour">{"Heure(s) d'assistance prévue :"}</label>
                <select id="productAssistanceHour" {...register('assistanceHour')}>
                  {assistanceHours.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.assistanceHour?.message}</p>
              </div>
              {showMoreHours && (
                <div className={styles.form_group}>
                  <label htmlFor="productAssistanceHourMore">{"Heures d'assistance"} :</label>
                  <Controller
                    control={control}
                    name="assistanceHourMore"
                    render={({ field: { value, onChange } }) => (
                      <AmountFormat
                        id="productAssistanceHourMore"
                        placeholder="10"
                        displayType="input"
                        decimalScale={0}
                        value={value}
                        onValueChange={(v) => onChange(v.value)}
                      />
                    )}
                  />
                  <p className={styles.errors}>{errors.assistanceHourMore?.message}</p>
                </div>
              )}
            </form>
          </div>
        </CardComponent>
        <div className={styles.footer_section}>
          <div className={styles.alert_section}>
            <p>*Informations obligatoires</p>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '1rem 0',
            }}
          >
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>
          <div className={styles.buttons_section}>
            <button className="btn btn-primary" onClick={() => goToPreviousStep()}>
              Précédent
            </button>
            <button className="btn btn-secondary" onClick={handleSubmit(onSubmit)}>
              Créer
            </button>
          </div>
        </div>
      </div>
    );
}
