import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { queries } from '../../../../utils/constants/queryKeys';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import CardComponent from '../../../Card/Card';
import CustomSelect from '../../../CustomSelect/CustomSelect';
import styles from './StepOne.module.scss';

const categoryOptions = [
  {
    value: 'Caméra universelle',
    text: 'Caméra conseillée FULL COLOR',
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

const yupSchema = yup.object().shape({
  reference: yup.string().required('La référence est requise.'),
  shortDescription: yup.string().required('La description est requise.'),
  longDescription: yup.string().nullable(),
  provider: yup.mixed<EnterpriseResponseDto>().required('Le représentant est requis'),
  // category: yup.string().required('La catégorie est requise'),
  categories: yup.array().of(yup.string().required('La catégorie est requise')).min(1, 'Au moins une catégorie est requise').required('Les catégories sont requises'),
  isVizeo: yup.boolean().required('Champs requis'),
  isVirtual: yup.boolean().required('Champs requis'),
  isNomenclature: yup.boolean().required('Champs requis'),
});

export type CreateProductStepOneType = yup.InferType<typeof yupSchema>;

type CreateProductModalComponentStepOneComponentProps = Readonly<{
  show: boolean;
  onSubmit: (data: CreateProductStepOneType) => void;
}>;
export default function CreateProductModalComponentStepOneComponent({ show, onSubmit }: CreateProductModalComponentStepOneComponentProps) {
  const { data: providers, isLoading: isLoadingProviders } = useQuery(queries.enterprise.list._ctx.providers);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  if (show)
    return (
      <div className={styles.card_container}>
        <CardComponent title="Informations générales">
          <div className={styles.form_container}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor="productReference" className={styles.required}>
                  <span>*</span>Référence produit :
                </label>
                <input id="productReference" placeholder="Référence produit" {...register('reference')} />
                <p className={styles.errors}>{errors.reference?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productShortDescription" className={styles.required}>
                  <span>*</span>Description :
                </label>
                <input id="productShortDescription" placeholder="Description" {...register('shortDescription')} />
                <p className={styles.errors}>{errors.shortDescription?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productLongDescription">Description longue :</label>
                <textarea id="productLongDescription" placeholder="Description longue" rows={8} {...register('longDescription')} />
                <p className={styles.errors}>{errors.longDescription?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productProvider">Fournisseur :</label>
                <select id="productProvider" {...register('provider', { setValueAs: (val: string) => providers?.find((provider) => provider.id === val) })}>
                  <option value="">{isLoadingProviders ? 'Chargement...' : 'Choisir un fournisseur'}</option>
                  {providers?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.provider?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="productCategories">Catégories :</label>
                <Controller
                  control={control}
                  name="categories"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      id="productCategories"
                      options={categoryOptions}
                      getOptionLabel={(opt) => opt.text}
                      getOptionValue={(opt) => opt.value}
                      placeholder="Sélectionner des catégories"
                      isLoading={false}
                      value={value?.map((val) => categoryOptions.find((opt) => val === opt.value)).filter((item) => item !== undefined)}
                      isMulti
                      onChange={(e) => onChange(e.map((item) => item.value))}
                    />
                  )}
                />
                {/* <select id="productCategory" {...register('categories')}>
                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </select> */}
                <p className={styles.errors}>{errors.categories?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="isVizeo">Marque VIZEO :</label>
                <select id="isVizeo" {...register('isVizeo', { setValueAs: (val) => val === 'Oui' })}>
                  {['Oui', 'Non'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.isVizeo?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="isVizeo">Produit virtuel :</label>
                <select id="isVirtual" {...register('isVirtual', { setValueAs: (val) => val === 'Oui' })} defaultValue="Non">
                  {['Oui', 'Non'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.isVirtual?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="isVizeo">Nomenclature :</label>
                <select id="isNomenclature" {...register('isNomenclature', { setValueAs: (val) => val === 'Oui' })} defaultValue="Non">
                  {['Oui', 'Non'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.isNomenclature?.message}</p>
              </div>
            </form>
          </div>
        </CardComponent>
        <div className={styles.footer_section}>
          <div className={styles.alert_section}>
            <p>*Informations obligatoires</p>
          </div>
          <div className={styles.buttons_section}>
            <button className="btn btn-secondary" onClick={handleSubmit(onSubmit)}>
              Suivant
            </button>
          </div>
        </div>
      </div>
    );
}
