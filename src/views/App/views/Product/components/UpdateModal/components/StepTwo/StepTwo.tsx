import { FieldErrors, UseFormRegister } from 'react-hook-form';
import CardComponent from '../../../../../../../../components/Card/Card';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { UpdateProductStepTwoSchema } from '../../UpdateModal';
import styles from './StepTwo.module.scss';
import { PulseLoader } from 'react-spinners';
import React from 'react';

const assistanceHours = [
  ...Array.from({ length: 10 }, (_, i) => i + 1).map((item) => ({ value: item, label: item.toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) })),
  {
    value: 11,
    label: 'Plus de 10',
  },
];

type AppViewProductViewUpdateModalComponentStepTwoComponentProps = Readonly<{
  product: ProductResponseDto;
  register: UseFormRegister<UpdateProductStepTwoSchema>;
  errors: FieldErrors<UpdateProductStepTwoSchema>;
  onReset: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent<object, unknown, unknown> | undefined) => Promise<void>;
  isPending: boolean;
}>;

export default function AppViewProductViewUpdateModalComponentStepTwoComponent({
  product,
  register,
  errors,
  onReset,
  onSubmit,
  isPending,
}: AppViewProductViewUpdateModalComponentStepTwoComponentProps) {
  return (
    <form className={styles.container} onSubmit={onSubmit} onReset={onReset}>
      <CardComponent title={'Modification du produit ' + product.reference}>
        <div className={styles.form_container}>
          <div className={styles.form_group}>
            <label htmlFor="purchasePrice">Tarif achat en $ :</label>
            <input id="purchasePrice" placeholder="0.00 $" type="number" {...register('purchasePrice')} />
            <p className="__errors">{errors.purchasePrice?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="costPrice" className={styles.required}>
              <span>*</span>Prix revient en € :
            </label>
            <input id="costPrice" placeholder="0.00 €" type="number" {...register('costPrice')} />
            <p className="__errors">{errors.costPrice?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="margin">Marge :</label>
            <input id="margin" placeholder="0.00" type="number" {...register('margin')} readOnly />
            <p className="__errors">{errors.margin?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="portOrService">Port / Service :</label>
            <input id="portOrService" placeholder="0.00" type="number" {...register('portOrService')} />
            <p className="__errors">{errors.portOrService?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="tax">Taxe / Douane :</label>
            <input id="tax" placeholder="0.00" type="number" {...register('tax')} />
            <p className="__errors">{errors.tax?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="price" className={styles.required}>
              <span>*</span>Prix public :
            </label>
            <input id="price" placeholder="0.00" type="number" {...register('price')} />
            <p className="__errors">{errors.price?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="ecoTax">Ecotaxe DEEE :</label>
            <input id="ecoTax" placeholder="0.00" type="number" {...register('ecoTax')} />
            <p className="__errors">{errors.ecoTax?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="assistanceHour">{"Heure(s) d'assistance prévue :"}</label>
            <select id="assistanceHour" {...register('assistanceHour')}>
              <option value={undefined}>Sélectionnez une option</option>
              {assistanceHours.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="__errors">{errors.assistanceHour?.message}</p>
          </div>
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
          <button type="reset" className="btn btn-primary">
            Précédent
          </button>
          <button type="submit" className="btn btn-secondary">
            Modifier
          </button>
        </div>
      </div>
    </form>
  );
}
