import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import CardComponent from '../../../../../../../../../../components/Card/Card';
import CategoryClient from '../../../../../../../../../../utils/enums/CategoryClient';
import countries from '../../../../../../../../../../utils/constants/countries';
import PhoneInput from 'react-phone-number-input/input';
import styles from './StepOne.module.scss';
import { E164Number } from 'libphonenumber-js';

const zipCodeRegex = /([A-Z0-9]{5})$/;

const categoryOptions = [
  {
    label: 'Choisir une catégorie',
    value: '',
  },
  {
    label: 'VIZEO',
    value: CategoryClient.VIZEO,
  },
  {
    label: 'Distributeur',
    value: CategoryClient.DISTRIBUTEUR,
  },
  {
    label: 'Distributeur VVA',
    value: CategoryClient.DISTRIBUTEUR_VVA,
  },
  {
    label: 'Installateur',
    value: CategoryClient.INSTALLATEUR,
  },
  {
    label: 'Représentant',
    value: CategoryClient.REPRESENTANT,
  },
  {
    label: "Bureau d'études",
    value: CategoryClient.BUREAU_ETUDE,
  },
  {
    label: 'Fournisseur',
    value: CategoryClient.FOURNISSEUR,
  },
  {
    label: 'Client',
    value: CategoryClient.CLIENT,
  },
  {
    label: 'Spécialiste',
    value: CategoryClient.SPECIALISTE,
  },
];

const yupSchema = yup.object().shape({
  name: yup.string().required("Le nom de l'entreprise est requis."),
  sign: yup.string().nullable(),
  category: yup.mixed<CategoryClient>().oneOf(Object.values(CategoryClient), 'La catégorie est requise').required(),
  addressLineOne: yup.string().required('Veuillez renseigner une adresse'),
  addressLineTwo: yup.string().nullable(),
  city: yup.string().required('La ville est requise'),
  zipCode: yup.string().required('Le code postal est requis').matches(zipCodeRegex, {
    message: 'Format invalide (doit contenir 05 caracteres (95012 / 2A256)',
    excludeEmptyString: true,
  }),
  country: yup.string().nullable(),
  email: yup.string().email('Formail de mail invalide').nullable(),
  phoneNumber: yup.string().nullable(),
});

export type CreateEnterpriseStepOneDataType = yup.InferType<typeof yupSchema>;

type AppViewToolsViewMenuViewCreateEnterpriseModalViewStepOneComponentProps = Readonly<{
  show: boolean;
  onSubmit: (data: CreateEnterpriseStepOneDataType) => void;
}>;
export default function AppViewToolsViewMenuViewCreateEnterpriseModalViewStepOneComponent({
  show,
  onSubmit,
}: AppViewToolsViewMenuViewCreateEnterpriseModalViewStepOneComponentProps) {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      country: 'France',
    },
  });

  if (show)
    return (
      <div className={styles.forms_container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent title="Informations générales">
            <div className={styles.card_container}>
              <div className={styles.form_group}>
                <label className={styles.required} htmlFor="company_name">
                  <span>*</span>
                  {"Nom de l'entreprise :"}
                </label>
                <input
                  {...register('name', {
                    setValueAs: (val: string) => val.toUpperCase(),
                  })}
                  placeholder="Nom de l'entreprise"
                  id="company_name"
                />
                <p className={styles.errors}>{errors.name?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className="label" htmlFor="company_signboard">
                  Enseigne
                </label>
                <input
                  {...register('sign', {
                    setValueAs: (val: string) => val.toUpperCase(),
                  })}
                  placeholder="Enseigne"
                  id="company_signboard"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.errors}>{errors.sign?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.required} htmlFor="company_category">
                  <span>*</span>Catégorie :
                </label>
                <select id="company_category" {...register('category')}>
                  {categoryOptions.map((itm, idx) => (
                    <option key={idx} value={itm.value}>
                      {itm.label}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.category?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.required} htmlFor="company_address_one">
                  <span className="required">*</span>Adresse 1 :
                </label>
                <input
                  {...register('addressLineOne', {
                    setValueAs: (val: string) => val.toUpperCase(),
                  })}
                  type="text"
                  placeholder="Adresse 1"
                  id="company_address_one"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.errors}>{errors.addressLineOne?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className="label" htmlFor="company_address_two">
                  Adresse 2 :
                </label>
                <input
                  {...register('addressLineTwo', {
                    setValueAs: (val: string) => val.toUpperCase(),
                  })}
                  type="text"
                  placeholder="Adresse 2"
                  id="company_address_two"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.errors}>{errors.addressLineTwo?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.required} htmlFor="company_zip_code">
                  <span>*</span>Code Postal :
                </label>
                <input {...register('zipCode')} type="text" placeholder="Code Postal" id="company_zip_code" autoCorrect="true" autoComplete="off" />
                <p className={styles.errors}>{errors.zipCode?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.required} htmlFor="company_city">
                  <span>*</span>Ville :
                </label>
                <input
                  {...register('city', {
                    setValueAs: (val: string) => val.toUpperCase(),
                  })}
                  type="text"
                  placeholder="Ville"
                  id="company_city"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.errors}>{errors.city?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className="label" htmlFor="company_email">
                  Email :
                </label>
                <input
                  {...register('email', {
                    setValueAs: (val: string) => val.toLowerCase(),
                  })}
                  type="email"
                  placeholder="Mail"
                  id="company_email"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.errors}>{errors.email?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className="label" htmlFor="company_country">
                  Pays :
                </label>
                <select id="company_country" {...register('country')}>
                  {countries.map((itm) => (
                    <option key={itm.code} value={itm.name}>
                      {itm.name}
                    </option>
                  ))}
                </select>
                <p className={styles.errors}>{errors.country?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className="label" htmlFor="company_phone_number">
                  Téléphone :
                </label>
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput value={value ? (value as E164Number) : undefined} onChange={onChange} id="company_phone_number" country="FR" placeholder="" />
                  )}
                />
                <p className={styles.errors}>{errors.phoneNumber?.message}</p>
              </div>
            </div>
          </CardComponent>
          <div className={styles.alert_section}>
            <p>*Informations obligatoires</p>
          </div>
          <div className={styles.step_buttons}>
            <button className="btn btn-secondary" type="submit">
              Suivant
            </button>
          </div>
        </form>
      </div>
    );
}
