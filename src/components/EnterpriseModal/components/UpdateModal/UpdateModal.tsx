import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { E164Number } from 'libphonenumber-js';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import PhoneInputWithCountrySelect from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { InferType, object, string } from 'yup';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import styles from './UpdateModal.module.scss';
import { queries } from '../../../../utils/constants/queryKeys';
import { updateEnterprise } from '../../../../utils/api/enterprise';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import countries from '../../../../utils/constants/countries';

const yupSchema = object({
  name: string()
    .required("Le nom de l'entreprise est obligatoire")
    .transform((value) => value.toUpperCase()),
  sign: string()
    .nullable()
    .transform((value) => value?.toUpperCase()),
  addressOne: string()
    .nullable()
    .transform((value) => value?.toUpperCase()),
  addressTwo: string()
    .nullable()
    .transform((value) => value?.toUpperCase()),
  city: string()
    .nullable()
    .transform((value) => value?.toUpperCase()),
  zipCode: string().nullable(),
  country: string().nullable(),
  email: string()
    .email('Formail de mail invalide')
    .nullable()
    .transform((value) => value?.toLowerCase()),
  phoneNumber: string().nullable(),
});

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/update');

type EnterpriseModalComponentUpdateModalComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onClose: () => void;
}>;
export default function EnterpriseModalComponentUpdateModalComponent({ enterprise, onClose }: EnterpriseModalComponentUpdateModalComponentProps) {
  const queryClient = useQueryClient();
  //   const navigate = routeApi.useNavigate();

  //   const { enterpriseId } = routeApi.useParams();

  //   const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: enterprise.name,
      sign: enterprise.sign,
      addressOne: enterprise.addressLineOne,
      addressTwo: enterprise.addressLineTwo,
      zipCode: enterprise.zipCode,
      city: enterprise.city ?? undefined,
      country: enterprise.country,
      email: enterprise.email,
      phoneNumber: enterprise.phoneNumber,
    },
  });

  //   const onClose = () => {
  //     navigate({ to: '..', search: true, replace: true, resetScroll: false });
  //   };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InferType<typeof yupSchema>) => {
      const department = await (async () => {
        const zipCode = data.zipCode;
        if (!zipCode) return undefined;
        const departments = await queryClient.ensureQueryData(queries.departments.list);
        return departments.find((item) => [zipCode.slice(0, 2), zipCode.slice(0, 3)].includes(item.code));
      })();
      return updateEnterprise(enterprise, {
        name: data.name,
        sign: data.sign,
        category: enterprise.category,
        addressLineOne: data.addressOne,
        addressLineTwo: data.addressTwo,
        zipCode: data.zipCode,
        city: data.city,
        department: department?.name,
        departmentCode: department?.code,
        country: data.country,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enterprises._def });
      toast.success('Entreprise modifiée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de l'entreprise");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>{"Modification de l'entreprise"}</h6>
        </div>
        <div className={styles.form_container}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.card_container}>
              <div className={styles.form__group}>
                <label className={styles.required} htmlFor="company_name">
                  <span>* </span>
                  {"Nom de l'entreprise :"}
                </label>
                <input {...register('name')} placeholder="Nom de l'entreprise" id="company_name" />
                <p className={styles.__errors}>{errors.name?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_signboard">
                  Enseigne
                </label>
                <input {...register('sign')} placeholder="Enseigne" id="company_signboard" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.sign?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.required} htmlFor="company_address_one">
                  <span className="required">* </span>Adresse 1 :
                </label>
                <input {...register('addressOne')} type="text" placeholder="Adresse 1" id="company_address_one" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.addressOne?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_address_two">
                  Adresse 2 :
                </label>
                <input {...register('addressTwo')} type="text" placeholder="Adresse 2" id="company_address_two" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.addressTwo?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.required} htmlFor="company_city">
                  <span>* </span>Ville :
                </label>
                <input {...register('city')} type="text" placeholder="Ville" id="company_city" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.city?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.required} htmlFor="company_zip_code">
                  <span>* </span>Code Postal :
                </label>
                <input {...register('zipCode')} type="text" placeholder="Code Postal" id="company_zip_code" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.zipCode?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_email">
                  Email :
                </label>
                <input {...register('email')} type="email" placeholder="Mail" id="company_email" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.email?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_country">
                  Pays :
                </label>
                <select id="company_country" {...register('country')}>
                  {countries.map(({ code, name }) => (
                    <option key={code} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <p className={styles.__errors}>{errors.country?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_phone_number">
                  Téléphone :
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <PhoneInputWithCountrySelect
                      value={value ? (value as E164Number) : undefined}
                      onChange={onChange}
                      onBlur={onBlur}
                      id="company_phone_number"
                      inputClassName={styles.phone_input}
                      placeholder=""
                      defaultCountry="FR"
                    />
                  )}
                />
                <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
              </div>
            </div>
            <div className={styles.alert_sections}>
              <p>*Informations obligatoires</p>
            </div>
            {isPending && (
              <div className={styles.form__request_loader}>
                <PropagateLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
              </div>
            )}
            <div className={styles.step_buttons}>
              <button className="btn btn-primary" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-secondary" style={{ marginLeft: '1rem' }} type="submit">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
