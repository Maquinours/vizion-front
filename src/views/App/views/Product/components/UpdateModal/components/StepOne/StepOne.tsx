import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import CardComponent from '../../../../../../../../components/Card/Card';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { UpdateProductStepOneSchema } from '../../UpdateModal';
import { useQuery } from '@tanstack/react-query';
import { enterprises } from '../../../../../../../../utils/constants/queryKeys/enterprise';
import styles from './StepOne.module.scss';

const categoryOptions = [
  {
    value: '',
    text: 'Choisir une catégorie',
  },
  {
    value: 'Caméra universelle',
    text: 'Caméra universelle FULL COLOR',
  },
  {
    value: 'Caméra interieure',
    text: 'Caméra interieure',
  },
  {
    value: 'Caméra exterieure',
    text: 'Caméra exterieure',
  },
  {
    value: 'Dôme motorisé',
    text: 'Dôme motorisé',
  },
  {
    value: 'Autres cameras',
    text: 'Autres cameras',
  },
  {
    value: 'NVR',
    text: 'NVR',
  },
  {
    value: 'Kit',
    text: 'Kit',
  },
  {
    value: 'Transmission',
    text: 'Transmission',
  },
  {
    value: 'Services',
    text: 'Services',
  },
  {
    value: 'Moniteur',
    text: 'Moniteur',
  },
  {
    value: 'Accessoires',
    text: 'Accessoires',
  },
];

const booleanSelectOptions = [
  { value: 'yes', label: 'Oui' },
  { value: 'no', label: 'Non' },
];

type AppViewProductViewUpdateModalComponentStepOneComponentProps = Readonly<{
  product: ProductResponseDto;
  register: UseFormRegister<UpdateProductStepOneSchema>;
  errors: FieldErrors<UpdateProductStepOneSchema>;
  control: Control<UpdateProductStepOneSchema>;
  onReset: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent<object, unknown, unknown> | undefined) => Promise<void>;
}>;
export default function AppViewProductViewUpdateModalComponentStepOneComponent({
  product,
  register,
  errors,
  control,
  onReset,
  onSubmit,
}: AppViewProductViewUpdateModalComponentStepOneComponentProps) {
  const { data: providers } = useQuery(enterprises.list._ctx.providers);

  return (
    <form className={styles.container} onSubmit={onSubmit} onReset={onReset}>
      <CardComponent title={'Modification du produit ' + product.reference}>
        <div className={styles.form_container}>
          <div className={styles.form_group}>
            <label htmlFor="reference" className={styles.required}>
              <span>*</span>Référence produit :
            </label>
            <input id="reference" placeholder="Référence produit" {...register('reference')} />
            <p className={styles.errors}>{errors.reference?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="shortDescription" className={styles.required}>
              <span>*</span>Description :
            </label>
            <input id="shortDescription" placeholder="Description" {...register('shortDescription')} />
            <p className={styles.errors}>{errors.shortDescription?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="longDescription">Description longue :</label>
            <textarea id="longDescription" placeholder="Description longue" rows={8} {...register('longDescription')} />
            <p className={styles.errors}>{errors.longDescription?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="provider">Fournisseur :</label>
            <Controller
              control={control}
              name="provider"
              render={({ field: { value, onChange, onBlur } }) => (
                <select id="provider" value={value?.id} onChange={(e) => onChange(providers?.find(({ id }) => id === e.target.value))} onBlur={onBlur}>
                  <option value="">Choisir un fournisseur</option>
                  {providers?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className={styles.errors}>{errors.provider?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="category">Catégorie :</label>
            <select id="category" {...register('category')}>
              {categoryOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.text}
                </option>
              ))}
            </select>
            <p className={styles.errors}>{errors.category?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="isVizeo">Marque VIZEO :</label>
            <select id="isVizeo" {...register('isVizeo')}>
              {booleanSelectOptions.map((item, idx) => {
                return (
                  <option key={idx} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <p className={styles.errors}>{errors.isVizeo?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="isVirtual">Produit virtuel :</label>
            <select id="isVirtual" {...register('isVirtual')}>
              {booleanSelectOptions.map((item) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <p className={styles.errors}>{errors.isVirtual?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="isNomenclature">Nomenclature :</label>
            <select id="isNomenclature" {...register('isNomenclature')}>
              {booleanSelectOptions.map((item, idx) => {
                return (
                  <option key={idx} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <p className={styles.errors}>{errors.isNomenclature?.message}</p>
          </div>
        </div>
      </CardComponent>
      <div className={styles.footer_section}>
        <p className={styles.alert_section}>*Informations obligatoires</p>
        <div className={styles.buttons_section}>
          <button type="reset" className="btn btn-primary">
            Annuler
          </button>
          <button type="submit" className="btn btn-secondary">
            Suivant
          </button>
        </div>
      </div>
    </form>
  );
}
