import React, { useEffect } from 'react';
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormResetField, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CardComponent from '../../../../../../../../components/Card/Card';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { UpdateProductStepTwoSchema } from '../../UpdateModal';
import styles from './StepTwo.module.scss';

type AppViewProductViewUpdateModalComponentStepTwoComponentProps = Readonly<{
  product: ProductResponseDto;
  errors: FieldErrors<UpdateProductStepTwoSchema>;
  watch: UseFormWatch<UpdateProductStepTwoSchema>;
  setValue: UseFormSetValue<UpdateProductStepTwoSchema>;
  getValues: UseFormGetValues<UpdateProductStepTwoSchema>;
  resetField: UseFormResetField<UpdateProductStepTwoSchema>;
  control: Control<UpdateProductStepTwoSchema>;
  onReset: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent<object, unknown, unknown> | undefined) => Promise<void>;
  isPending: boolean;
}>;

export default function AppViewProductViewUpdateModalComponentStepTwoComponent({
  product,
  errors,
  watch,
  setValue,
  getValues,
  resetField,
  control,
  onReset,
  onSubmit,
  isPending,
}: AppViewProductViewUpdateModalComponentStepTwoComponentProps) {
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
    <form className={styles.container} onSubmit={onSubmit} onReset={onReset}>
      <CardComponent title={'Modification du produit ' + product.reference}>
        <div className={styles.form_container}>
          <div className={styles.form_group}>
            <label htmlFor="purchasePrice">Tarif achat en $ :</label>
            <Controller
              control={control}
              name="purchasePrice"
              render={({ field: { value, onChange } }) => (
                <AmountFormat id="purchasePrice" displayType="input" value={value} suffix=" $" decimalScale={2} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className="__errors">{errors.purchasePrice?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="costPrice" className={styles.required}>
              <span>*</span>Prix revient en € :
            </label>
            <Controller
              control={control}
              name="costPrice"
              render={({ field: { value, onChange } }) => (
                <CurrencyFormat id="costPrice" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className="__errors">{errors.costPrice?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="margin">Marge :</label>
            <Controller
              control={control}
              name="margin"
              render={({ field: { value } }) => (
                <AmountFormat id="margin" displayType="input" allowNegative placeholder="0.00 %" suffix="%" decimalScale={2} value={value} readOnly />
              )}
            />
            <p className="__errors">{errors.margin?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="portOrService">Port / Service :</label>
            <Controller
              control={control}
              name="portOrService"
              render={({ field: { value, onChange } }) => (
                <CurrencyFormat id="portOrService" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className="__errors">{errors.portOrService?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="tax">Taxe / Douane :</label>
            <Controller
              control={control}
              name="tax"
              render={({ field: { value, onChange } }) => (
                <CurrencyFormat id="tax" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className="__errors">{errors.tax?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="price" className={styles.required}>
              <span>*</span>Prix public :
            </label>
            <Controller
              control={control}
              name="price"
              render={({ field: { value, onChange } }) => (
                <CurrencyFormat id="price" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className="__errors">{errors.price?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="ecoTax">Ecotaxe DEEE :</label>
            <Controller
              control={control}
              name="ecoTax"
              render={({ field: { value, onChange } }) => (
                <CurrencyFormat id="ecoTax" displayType="input" value={value} onValueChange={(v) => onChange(v.value)} />
              )}
            />
            <p className="__errors">{errors.ecoTax?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="productAssistanceHourMore">{"Heures d'assistance"} :</label>
            <Controller
              control={control}
              name="assistanceHour"
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
            <p className={styles.errors}>{errors.assistanceHour?.message}</p>
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
