import * as yup from 'yup';
import ProfileClient from '../../../../utils/enums/ProfileClient';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import { toast } from 'react-toastify';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import { useMemo, useState } from 'react';
import { createProfile, getEmailExists, getIdentifierExists } from '../../../../utils/api/profile';
import { checkPassword, generatePassword } from '../../../../utils/functions/passwords';
import { formatPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/input';
import { CgCopy, CgPassword } from 'react-icons/cg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCheckCircleOutline, MdOutlineCancel } from 'react-icons/md';
import { PropagateLoader } from 'react-spinners';
import ReactModal from 'react-modal';
import styles from './StepOne.module.scss';
import { E164Number } from 'libphonenumber-js';

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
  siteIdentifier: yup
    .string()
    .nullable()
    .min(2, 'Au moins deux caractères')
    .transform((val: string | null | undefined) => {
      const trimmed = val?.trim();
      if (trimmed === '') return null;
      return trimmed?.toLowerCase();
    }),
  password: yup
    .string()
    .nullable()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val))
    .when('identifiant', {
      is: (val: string | null | undefined) => val && val.trim() !== '',
      then: () =>
        yup
          .string()
          .required('Champs requis')
          .matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,.]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, 'Format invalide'),
    }),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val))
    .when('identifiant', {
      is: (val: string | null | undefined) => val && val.trim() !== '',
      then: () =>
        yup
          .string()
          .required('Champs requis')
          .oneOf([yup.ref('pass')], 'Mots de passe non identiques.'),
    }),
  profileClient: yup.mixed<ProfileClient>().oneOf(Object.values(ProfileClient), 'Champs requis').required('Champs requis'),
});

type CreateContactModalComponentStepOneComponentProps = Readonly<{
  onAfterCreation: (contact: ProfileResponseDto) => void;
  onClose: () => void;
  enterprise: EnterpriseResponseDto;
}>;
export default function CreateContactModalComponentStepOneComponent({
  onAfterCreation,
  onClose,
  enterprise,
}: CreateContactModalComponentStepOneComponentProps) {
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: { civility: 'Monsieur', expert: 'no', profileClient: ProfileClient.COMMERCIAL },
  });

  const pass = useWatch({ name: 'password', control });
  const email = useWatch({ name: 'email', control });
  const identifier = useWatch({ name: 'siteIdentifier', control });

  const { data: emailExists, refetch: refetchEmail } = useQuery({
    queryKey: ['email-exists', email],
    queryFn: () => (!email ? false : getEmailExists(email)),
    initialData: false,
    enabled: false,
  });

  const { data: identifierExists, refetch: refetchIdentifier } = useQuery({
    queryKey: ['identifier-exists', identifier],
    queryFn: () => (!identifier ? false : getIdentifierExists(identifier)),
    initialData: false,
    enabled: false,
  });

  const passwordValidation = useMemo(() => checkPassword(pass), [pass]);

  const onGeneratePassword = () => {
    const password = generatePassword();
    setValue('password', password);
    setValue('confirmPassword', password);
  };

  const onCopyPassword = () => {
    if (pass)
      navigator.clipboard
        .writeText(pass)
        .then(() => {
          toast.success('Mot de passe copié avec succès.');
        })
        .catch((error) => {
          console.error(error);
          toast.error('Erreur lors de la copie du mot de passe.');
        });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      lastName,
      firstName,
      civility,
      email,
      password,
      phoneNumber,
      standardPhoneNumber,
      landlinePhoneNumber,
      job,
      profileClient,
      siteIdentifier,
      expert,
    }: yup.InferType<typeof yupSchema>) =>
      createProfile({
        lastName,
        firstName,
        civility,
        email,
        password,
        phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber as E164Number) : phoneNumber,
        standardPhoneNumber: standardPhoneNumber ? formatPhoneNumber(standardPhoneNumber as E164Number) : standardPhoneNumber,
        landlinePhoneNumber,
        job,
        profileClient: profileClient,
        siteIdentifier,
        enterpriseId: enterprise.id,
        expert: expert === 'yes',
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: enterprises._def });
      toast.success('Contact créé avec succès.');
      onAfterCreation(data);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du contact.');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un contact</h6>
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
                <input type="text" placeholder="Dupont" {...register('lastName')} id="lastName" autoCorrect="off" autoComplete="off" />
                <p className={styles.__errors}>{errors.lastName?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="firstName">
                  Prénom :
                </label>
                <input type="text" placeholder="Etienne" {...register('firstName')} id="firstName" autoCorrect="off" autoComplete="off" />
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
                    name="phoneNumber"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <PhoneInput
                        value={value ? (value as E164Number) : undefined}
                        onChange={onChange}
                        onBlur={onBlur}
                        id="phoneNumber"
                        defaultCountry="FR"
                        placeholder="Fixe"
                      />
                    )}
                  />
                  <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
                </div>
                <div className={styles.form__input_group}>
                  <input id="landlinePhoneNumber" type="text" placeholder="Agence" {...register('landlinePhoneNumber')} />
                  <p className={styles.__errors}>{errors.landlinePhoneNumber?.message}</p>
                </div>
                <div className={styles.form__input_group}>
                  <Controller
                    name="standardPhoneNumber"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <PhoneInput
                        value={value ? (value as E164Number) : undefined}
                        onChange={onChange}
                        onBlur={onBlur}
                        id="standardPhoneNumber"
                        defaultCountry="FR"
                        placeholder="Portable"
                      />
                    )}
                  />
                  <p className={styles.__errors}>{errors.standardPhoneNumber?.message}</p>
                </div>
              </div>
            </div>
            <div className={styles.form__row_two}>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="name">
                  Mail :
                </label>
                <input
                  type="email"
                  placeholder="dupont.etienne@gmail.com"
                  aria-invalid={errors.email ? true : false}
                  {...register('email')}
                  id="mail"
                  autoCorrect="true"
                  onBlur={() => refetchEmail()}
                />
                <p className={styles.__errors}>
                  {errors.email?.message}
                  {emailExists && <span>Email déjà utilisé</span>}
                </p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="job">
                  Fonction :
                </label>
                <input placeholder="Vendeur" type="text" {...register('job')} id="job" autoCorrect="off" autoComplete="off" />
                <p className={styles.__errors}>{errors.job?.message}</p>
              </div>
            </div>
            <div className={styles.form__row_one}>
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
            </div>

            <div className={styles.form__divider} />

            <div className={styles.form__row_two}>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="name">
                  Identifiant site :
                </label>
                <input
                  placeholder="De1019"
                  type="text"
                  {...register('siteIdentifier')}
                  id="identifiant"
                  autoCorrect="true"
                  style={{ textTransform: 'lowercase' }}
                  onBlur={() => refetchIdentifier()}
                />
                <p className={styles.__errors}>
                  {errors.siteIdentifier?.message}
                  {identifierExists && <span>Identifiant déjà utilisé</span>}
                </p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="pass">
                  Mot de passe :
                </label>

                <input
                  placeholder="********"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  id="pass"
                  autoCorrect="off"
                  autoComplete="new-password"
                />
                <p className={styles.__errors}>{errors.password?.message}</p>
                <CgPassword onClick={onGeneratePassword} />
                {!showPassword ? <FaEye onClick={() => setShowPassword(true)} /> : <FaEyeSlash onClick={() => setShowPassword(false)} />}
                {pass && <CgCopy onClick={onCopyPassword} />}
              </div>
            </div>

            {pass && !passwordValidation.isValid && (
              <div className={styles.password_specifications}>
                <p>Doit contenir au moins</p>
                <ul>
                  <li>
                    {passwordValidation.validationRules.length ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>8 caractères</span>
                  </li>
                  <li>
                    {passwordValidation.validationRules.upper ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>une lettre majuscule (A-Z)</span>
                  </li>
                  <li>
                    {passwordValidation.validationRules.lower ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>une lettre miniscule (a-z)</span>
                  </li>
                  <li>
                    {passwordValidation.validationRules.number ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}

                    <span>un chiffre (0-9)</span>
                  </li>
                  <li className="mr-2">
                    {passwordValidation.validationRules.special ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>{'un caractere special ("#$%\'\\*+@...)'}</span>
                  </li>
                </ul>
              </div>
            )}
            <div className={styles.form__row_two}>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="profileClient">
                  Profil Client :
                </label>
                <select id="profileClient" {...register('profileClient')}>
                  {profileClientOptions.map((itm, idx) => {
                    return (
                      <option key={idx} value={itm.value}>
                        {itm.text}
                      </option>
                    );
                  })}
                </select>
                <p className={styles.__errors}>{errors.profileClient?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="confirm">
                  Confirmer MDP :
                </label>
                <input
                  placeholder="********"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  id="confirm"
                  autoCorrect="true"
                />
                <p className={styles.__errors}>{errors.confirmPassword?.message}</p>
                {!showConfirmPassword ? <FaEye onClick={() => setShowConfirmPassword(true)} /> : <FaEyeSlash onClick={() => setShowConfirmPassword(false)} />}
              </div>
            </div>
          </div>
          <div className={styles.form_request_loader}>
            <PropagateLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
          </div>
          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button className="btn btn-secondary" type="submit">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
