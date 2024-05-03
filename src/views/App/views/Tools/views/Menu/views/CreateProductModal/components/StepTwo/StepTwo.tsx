import { useForm } from 'react-hook-form';
import CardComponent from '../../../../../../../../../../components/Card/Card';
import styles from './StepTwo.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PulseLoader } from 'react-spinners';
import { useEffect, useState } from 'react';

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

type AppViewToolsViewMenuViewCreateProductModalViewStepTwoComponentProps = Readonly<{
  show: boolean;
  goToPreviousStep: () => void;
  onSubmit: (data: CreateProductStepTwoType) => void;
  isPending: boolean;
}>;
export default function AppViewToolsViewMenuViewCreateProductModalViewStepTwoComponent({
  show,
  goToPreviousStep,
  onSubmit,
  isPending,
}: AppViewToolsViewMenuViewCreateProductModalViewStepTwoComponentProps) {
  const [showMoreHours, setShowMoreHours] = useState(false);

  const {
    register,
    watch,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {
    if (getValues('assistanceHour') === 'More') setShowMoreHours(true);
    else setShowMoreHours(false);
  }, [watch('assistanceHour')]);

  if (show)
    return (
      <div className={styles.card_container}>
        <CardComponent title="Informations générales">
          <div className={styles.form_container}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor="productPurchasePrice">Tarif achat en $ :</label>
                <input id="productPurchasePrice" placeholder="0.00 $" type="number" {...register('purchasePrice')} />
                <p className={styles.errors}>{errors.purchasePrice?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productCostPrice" className={styles.required}>
                  <span>*</span>Prix revient en € :
                </label>
                <input id="productCostPrice" placeholder="0.00 €" type="number" {...register('costPrice')} />
                <p className={styles.errors}>{errors.costPrice?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productMargin">Marge :</label>
                <input id="productMargin" placeholder="0.00" type="number" {...register('margin')} readOnly />
                <p className={styles.errors}>{errors.margin?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productPortOrService">Port / Service :</label>
                <input id="productPortOrService" placeholder="0.00" type="number" {...register('shippingService')} />
                <p className={styles.errors}>{errors.shippingService?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productTax">Taxe / Douane :</label>
                <input id="productTax" placeholder="0.00" type="number" {...register('tax')} />
                <p className={styles.errors}>{errors.tax?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productPrice" className={styles.required}>
                  <span>*</span>Prix public :
                </label>
                <input id="productPrice" placeholder="0.00" type="number" {...register('price')} />
                <p className={styles.errors}>{errors.price?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productEcoTax">Ecotaxe DEEE :</label>
                <input id="productEcoTax" placeholder="0.00" type="number" {...register('ecoTax')} />
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
                  <input id="productAssistanceHourMore" placeholder="0.00" type="number" {...register('assistanceHourMore')} />
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
