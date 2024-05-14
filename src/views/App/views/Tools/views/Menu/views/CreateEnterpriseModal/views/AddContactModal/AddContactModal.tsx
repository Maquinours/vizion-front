import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CgCopy, CgPassword } from 'react-icons/cg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCheckCircleOutline, MdOutlineCancel } from 'react-icons/md';
import ReactModal from 'react-modal';
import PhoneInput from 'react-phone-number-input/input';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { getEmailExists, getIdentifierExists } from '../../../../../../../../../../utils/api/profile';
import ProfileClient from '../../../../../../../../../../utils/enums/ProfileClient';
import { checkPassword, generatePassword } from '../../../../../../../../../../utils/functions/passwords';
import styles from './AddContactModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CreateEnterpriseContext } from '../../utils/contexts/context';
import { E164Number } from 'libphonenumber-js';

const routeApi = getRouteApi('/app/tools/menu/create-enterprise/add-contact');

const profileClientOptions = [
  { value: '', text: 'Choisir' },
  { value: ProfileClient.DIRECTION, text: 'DIRECTION' },
  { text: ProfileClient.COMMERCIAL, value: 'COMMERCIAL' },
  { value: ProfileClient.TECHNICIEN, text: 'TECHNICIEN' },
  { value: ProfileClient.STAGIAIRE, text: 'STAGIAIRE' },
];

const yupSchema = yup.object().shape({
  civility: yup.string().required('La civilité est requise.'),
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
  expert: yup.string().required('Champs requis'),
  siteIdentifier: yup
    .string()
    .nullable()
    .min(2, 'Au moins deux caractères')
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val)),
  password: yup
    .string()
    .nullable()
    .transform((val) => (typeof val !== 'string' || val.trim() === '' ? null : val))
    .when('siteIdentifier', {
      is: (val: string | null | undefined) => !!val && val.trim() !== '',
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
    .when('siteIdentifier', {
      is: (val: string | null | undefined) => !!val && val.trim() !== '',
      then: () =>
        yup
          .string()
          .required('Champs requis')
          .oneOf([yup.ref('password')], 'Mots de passe non identiques.'),
    }),
  profileClient: yup.string().typeError('Format invalide').required('Requis'),
});

export default function AppViewToolsViewMenuViewCreateEnterpriseModalViewAddContactModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationRules, setValidationRules] = useState<{
    isValid: boolean;
    validationRules: {
      length: boolean;
      upper: boolean;
      lower: boolean;
      special: boolean;
      number: boolean;
    };
  }>();

  const { setContacts } = useContext(CreateEnterpriseContext)!;

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const email = watch('email');
  const identifier = watch('siteIdentifier');

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

  const onGeneratePassword = () => {
    const password = generatePassword();
    setValue('password', password);
    setValue('confirmPassword', password);
  };

  const onCopyPassword = () => {
    const password = getValues('password');
    if (password)
      navigator.clipboard
        .writeText(password)
        .then(() => {
          toast.success('Mot de passe copié avec succès.');
        })
        .catch((error) => {
          console.error(error);
          toast.error('Erreur lors de la copie du mot de passe.');
        });
  };

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const onSubmit = (data: yup.InferType<typeof yupSchema>) => {
    setContacts((prev) => [...prev, { ...data, expert: data.expert === 'yes' }]);
    onClose();
  };

  useEffect(() => {
    setValidationRules(checkPassword(getValues('password')));
  }, [watch('password')]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className="Modal" overlayClassName="Overlay">
      <div className={styles.modal}>
        <div className={styles.modal_title}>
          <h6>Ajouter un contact</h6>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} autoComplete="off" autoCorrect="off">
          <div className={styles.form_container}>
            <div className={styles.form__row_one}>
              <div className={styles.form__group}>
                <label className={styles.form__label}>Civilité :</label>
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
                    render={({ field: { value, onChange } }) => (
                      <PhoneInput
                        value={value ? (value as E164Number) : undefined}
                        onChange={onChange}
                        id="first_phoneNumber"
                        country="FR"
                        placeholder="Fixe"
                      />
                    )}
                  />
                  <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
                </div>
                <div className={styles.form__input_group}>
                  <input id="second_phoneNumber" type="text" placeholder="Agence" {...register('landlinePhoneNumber')} />
                  <p className={styles.__errors}>{errors.landlinePhoneNumber?.message}</p>
                </div>
                <div className={styles.form__input_group}>
                  <Controller
                    control={control}
                    name="standardPhoneNumber"
                    render={({ field: { value, onChange } }) => (
                      <PhoneInput
                        value={value ? (value as E164Number) : undefined}
                        onChange={onChange}
                        id="third_phoneNumber"
                        country="FR"
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
                  autoComplete="no"
                  onBlur={() => refetchEmail()}
                />
                <p className={styles.__errors}>
                  {errors.email?.message}
                  {emailExists && <span>Email déjà utilisé</span>}
                </p>
              </div>
              <div className={styles.form__group}>
                <label className={styles.label} htmlFor="name">
                  Fonction :
                </label>
                <input placeholder="Vendeur" type="text" {...register('job')} id="activity" autoCorrect="off" autoComplete="off" />
                <p className={styles.__errors}>{errors.job?.message}</p>
              </div>
            </div>
            <div className={styles.form__row_one}>
              <div className={styles.form__group}>
                <label className={styles.form__label}>Expert :</label>
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
                  autoComplete="no"
                  style={{ textTransform: 'lowercase' }}
                  onBlur={() => refetchIdentifier()}
                />
                <p className={styles.__errors}>
                  {errors.siteIdentifier?.message}
                  {identifierExists && <span>Identifiant déjà utilisé</span>}
                </p>
              </div>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <div className={styles.form__group}>
                    <label className={styles.label} htmlFor="pass">
                      Mot de passe :
                    </label>

                    <input
                      placeholder="********"
                      type={showPassword ? 'text' : 'password'}
                      id="pass"
                      autoCorrect="off"
                      autoComplete="new-password"
                      value={value ?? undefined}
                      onChange={onChange}
                    />
                    <p className={styles.__errors}>{errors.password?.message}</p>
                    <CgPassword onClick={() => onGeneratePassword()} />
                    {!showPassword ? <FaEye onClick={() => setShowPassword(!showPassword)} /> : <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />}
                    {value && <CgCopy onClick={() => onCopyPassword()} />}
                  </div>
                )}
              />
            </div>

            {validationRules && (
              <div className={styles.password_specifications}>
                <p>Doit contenir au moins</p>
                <ul>
                  <li>
                    {validationRules.validationRules.length ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>8 caractères</span>
                  </li>
                  <li>
                    {validationRules.validationRules.upper ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>une lettre majuscule (A-Z)</span>
                  </li>
                  <li>
                    {validationRules.validationRules.lower ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                    <span>une lettre miniscule (a-z)</span>
                  </li>
                  <li>
                    {validationRules.validationRules.number ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}

                    <span>un chiffre (0-9)</span>
                  </li>
                  <li className="mr-2">
                    {validationRules.validationRules.special ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
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
                  {profileClientOptions.map((itm, idx) => (
                    <option key={idx} value={itm.value}>
                      {itm.text}
                    </option>
                  ))}
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
                  name="confirm"
                  id="confirm"
                  autoCorrect="true"
                  autoComplete="no"
                />
                <p className={styles.__errors}>{errors.confirmPassword?.message}</p>
                {!showConfirmPassword ? (
                  <FaEye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                ) : (
                  <FaEyeSlash onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                )}
              </div>
            </div>
          </div>
          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
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
