import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import PhoneInput, { formatPhoneNumber } from 'react-phone-number-input/input';
import { PropagateLoader } from 'react-spinners';
import * as yup from 'yup';
import { getEmailExists, updateProfile } from '../../utils/api/profile';
import { queries } from '../../utils/constants/queryKeys';
import ProfileClient from '../../utils/enums/ProfileClient';
import styles from './UpdateContactModal.module.scss';

const profileClientOptions = [
  { value: '', text: 'Sélectionnez un profil' },
  { value: ProfileClient.DIRECTION, text: 'DIRECTION' },
  { text: ProfileClient.COMMERCIAL, value: 'COMMERCIAL' },
  { value: ProfileClient.TECHNICIEN, text: 'TECHNICIEN' },
  { value: ProfileClient.STAGIAIRE, text: 'STAGIAIRE' },
];

const yupSchema = yup.object().shape({
  civility: yup.string().oneOf(['Monsieur', 'Madame', 'Service']).required('La civilité est requise.'),
  lastName: yup.string().required('Le nom est requis'),
  firstName: yup.string().nullable(),
  phoneNumber: yup
    .string()
    .min(8, '8 caractères minimum')
    .max(25, '25 caractères maximum')
    .nullable()
    .transform((value) => (value ? value : null)),
  landlinePhoneNumber: yup
    .string()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val))
    .typeError('Format invalide')
    .nullable(),
  standardPhoneNumber: yup
    .string()
    .min(8, '8 caractères minimum')
    .max(25, '25 caractères maximum')
    .nullable()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val)),
  email: yup
    .string()
    .email('Format de mail invalide')
    .nullable()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val)),
  job: yup
    .string()
    .nullable()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val)),
  expert: yup.string().oneOf(['yes', 'no']).required('Champs requis'),
  profileClient: yup.mixed<ProfileClient>().typeError('Format invalide').required('Requis'),
});

type UpdateContactModalComponentProps = Readonly<{
  contactId: string;
  onClose: () => void;
}>;

export default function UpdateContactModalComponent({ contactId, onClose }: UpdateContactModalComponentProps) {
  const { data: contact } = useSuspenseQuery(queries.profiles.detail(contactId));

  const {
    register,
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      civility:
        contact.civility && ['Monsieur', 'Madame', 'Service'].includes(contact.civility) ? (contact.civility as 'Monsieur' | 'Madame' | 'Service') : undefined,
      firstName: contact.firstName,
      lastName: contact.lastName ?? '',
      phoneNumber: contact.phoneNumber,
      landlinePhoneNumber: contact.landlinePhoneNumber,
      standardPhoneNumber: contact.standardPhoneNumber,
      email: contact.email,
      job: contact.job,
      expert: contact.expert ? 'yes' : 'no',
      profileClient: contact.profileClient ?? undefined,
    },
  });

  const email = watch('email');

  const { data: emailExists, refetch: refetchEmail } = useQuery({
    queryKey: ['email-exists', email],
    queryFn: () => (!email ? false : getEmailExists(email)),
    initialData: false,
    select: (data) => (email === contact.email ? false : data),
    enabled: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      lastName,
      firstName,
      civility,
      phoneNumber,
      standardPhoneNumber,
      landlinePhoneNumber,
      job,
      profileClient,
      expert,
      email,
    }: yup.InferType<typeof yupSchema>) =>
      updateProfile(contact, {
        lastName,
        firstName,
        civility,
        phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber) : phoneNumber,
        standardPhoneNumber: standardPhoneNumber ? formatPhoneNumber(standardPhoneNumber) : standardPhoneNumber,
        landlinePhoneNumber: landlinePhoneNumber,
        job: job,
        profileClient,
        enterpriseId: contact.enterprise!.id,
        expert: expert === 'yes',
        email,
      }),
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className="Modal" overlayClassName="Overlay">
      <div className={styles.modal}>
        <div className={styles.modal_title}>
          <h6>Modification du contact {`${contact.firstName} ${contact.lastName}`}</h6>
        </div>
        <form className={styles.form} onSubmit={handleSubmit((data) => mutate(data))} onReset={() => onClose()} autoComplete="off" autoCorrect="off">
          <div className={styles.form_container}>
            <div className={styles.form__row_one}>
              <div className={styles.form__group}>
                <p className={styles.form__label}>Civilité :</p>
                <div className={styles.form__radio__group}>
                  <div className={styles.form__radio}>
                    <input type="radio" id="civility-monsieur" {...register('civility')} value="Monsieur" />
                    <label className={styles.label} htmlFor="civility-monsieur">
                      Monsieur
                    </label>
                  </div>
                  <div className={styles.form__radio}>
                    <input type="radio" id="civility-madame" {...register('civility')} value="Madame" />
                    <label className={styles.label} htmlFor="civility-madame">
                      Madame
                    </label>
                  </div>
                  <div className={styles.form__radio}>
                    <input type="radio" id="civility-service" {...register('civility')} value="Service" />
                    <label className={styles.label} htmlFor="civility-service">
                      Service
                    </label>
                  </div>
                </div>
                <p className={styles.__errors}>{errors.civility?.message}</p>
              </div>
            </div>
            <div className={styles.form__row_two}>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="name">
                  Nom :
                </label>
                <input type="text" {...register('lastName')} name="lastName" id="lastName" autoCorrect="off" autoComplete="off" />
                <p className={styles.__errors}>{errors.lastName?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="firstName">
                  Prénom :
                </label>
                <input type="text" {...register('firstName')} name="firstName" id="firstName" autoCorrect="off" autoComplete="off" />
                <p className={styles.__errors}>{errors.firstName?.message}</p>
              </div>
            </div>
            <div className={styles.form__row_three}>
              <label className={styles.label} htmlFor="phoneNumbers">
                Téléphone :
              </label>
              <div className={styles.form__input_groups}>
                <div className={styles.form__input_group}>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <PhoneInput country="FR" placeholder="Fixe" value={value ?? undefined} onChange={onChange} onBlur={onBlur} />
                    )}
                  />
                  <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
                </div>
                <div className={styles.form__input_group}>
                  <input type="text" placeholder="Agence" {...register('landlinePhoneNumber')} />
                  <p className={styles.__errors}>{errors.landlinePhoneNumber?.message}</p>
                </div>
                <div className={styles.form__input_group}>
                  <Controller
                    control={control}
                    name="standardPhoneNumber"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <PhoneInput country="FR" placeholder="Portable" value={value ?? undefined} onChange={onChange} onBlur={onBlur} />
                    )}
                  />
                  <p className={styles.__errors}>{errors.standardPhoneNumber?.message}</p>
                </div>
              </div>
            </div>
            <div className={styles.form__row_four}>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="emailAddress">
                  Adresse email :
                </label>
                <input type="email" {...register('email')} id="emailAddress" style={{ textTransform: 'lowercase' }} onBlur={() => refetchEmail()} />
                <p className={styles.__errors}>
                  {errors.email?.message}
                  {emailExists && <span>Email déjà utilisé</span>}
                </p>
              </div>
            </div>
            <div className={styles.form__row_two}>
              <div className={styles.form__group}>
                <p className={styles.form__label}>Expert :</p>
                <div className={styles.form__radio__group}>
                  <div className={styles.form__radio}>
                    <input type="radio" id="expert-yes" {...register('expert')} value="yes" />
                    <label className={styles.label} htmlFor="expert-yes">
                      Oui
                    </label>
                  </div>
                  <div className={styles.form__radio}>
                    <input type="radio" id="expert-no" {...register('expert')} value="no" />
                    <label className={styles.label} htmlFor="expert-no">
                      Non
                    </label>
                  </div>
                </div>
                <p className={styles.__errors}>{errors.expert?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="profileClient">
                  Profil Client :
                </label>
                <select id="profileClient" {...register('profileClient')}>
                  {profileClientOptions.map((itm, idx) => (
                    <option key={idx} value={itm.value}>
                      {itm.text}
                    </option>
                  ))}
                </select>
                <p className={styles.__errors}>{errors.profileClient?.message}</p>
              </div>
            </div>

            <div className={styles.form__divider} />
          </div>
          <div className={styles.form_request_loader}>
            <PropagateLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
          </div>
          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button className="btn btn-secondary" type="submit">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
