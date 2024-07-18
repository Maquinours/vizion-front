import { useMemo, useState } from 'react';
import * as yup from 'yup';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getEmailExists, getIdentifierExists, updateUserCredentials } from '../../../../utils/api/profile';
import { checkPassword, generatePassword } from '../../../../utils/functions/passwords';
import { toast } from 'react-toastify';
import { CgCopy, CgPassword } from 'react-icons/cg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCheckCircleOutline, MdOutlineCancel } from 'react-icons/md';
import { PulseLoader } from 'react-spinners';
import ReactModal from 'react-modal';
import styles from './StepOne.module.scss';

const yupSchema = yup.object().shape({
  mail: yup.string().email('Format de mail invalide').required('Email requis'),
  siteIdentifier: yup
    .string()
    .transform((value: string | undefined) => value?.trim().toLowerCase())
    .min(2, 'Au moins deux caractères')
    .required("L'identifiant est requis"),
  pass: yup
    .string()
    .transform((value) => (value ? value : null))
    .matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, 'Format invalide')
    .required('Mot de passe requis'),
  confirm: yup
    .string()
    .required('Confirmez le mot de passe')
    .oneOf([yup.ref('pass')], 'Mots de passe non identiques.')
    .transform((value) => (value ? value : null)),
});

type UpdateContactPasswordModalComponentStepOneComponent = Readonly<{
  contact: ProfileResponseDto;
  onAfterUpdate: (contact: ProfileResponseDto) => void;
  onClose: () => void;
}>;
export default function UpdateContactPasswordModalComponentStepOneComponent({
  contact,
  onAfterUpdate,
  onClose,
}: UpdateContactPasswordModalComponentStepOneComponent) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      mail: contact.email ?? '',
      siteIdentifier: contact.siteIdentifier ?? '',
      pass: contact.password ?? '',
      confirm: contact.password ?? '',
    },
  });

  const email = watch('mail');
  const username = watch('siteIdentifier');
  const password = watch('pass');

  const { data: emailExists, refetch: refetchEmail } = useQuery({
    queryKey: ['email-exists', email],
    queryFn: () => (!email ? false : getEmailExists(email)),
    initialData: false,
    enabled: false,
    select: (data) => (email === contact.email ? false : data),
  });

  const { data: usernameExists, refetch: refetchUsername } = useQuery({
    queryKey: ['username-exists', username],
    queryFn: () => (!username ? false : getIdentifierExists(username)),
    initialData: false,
    enabled: false,
    select: (data) => (username === contact.siteIdentifier ? false : data),
  });

  const passwordValidation = useMemo(() => checkPassword(password), [password]);

  const onGeneratePassword = () => {
    const password = generatePassword();
    setValue('pass', password);
    setValue('confirm', password);
  };

  const onCopyPassword = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => toast.success('Mot de passe copié'))
      .catch((error) => {
        console.error(error);
        toast.error('Une erreur est survenue lors de la copie du mot de passe');
      });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ mail, pass, siteIdentifier }: yup.InferType<typeof yupSchema>) =>
      updateUserCredentials({
        profileId: contact.id,
        email: mail,
        password: pass,
        siteIdentifier,
      }),
    onSuccess: (data) => {
      toast.success('Les informations de connexion ont été modifiés avec succès');
      onAfterUpdate(data);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification des informations de connexion');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.modal_title}>
          <h6>
            Modification du mot de passe de
            {` ${contact.firstName ?? ''} ${contact.lastName}`}
          </h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose} autoComplete="off" autoCorrect="off">
            <div className={styles.form__group}>
              <label className={styles.label} htmlFor="mail">
                Email :
              </label>
              <input type="email" {...register('mail')} id="mail" style={{ textTransform: 'lowercase' }} onBlur={() => refetchEmail()} />
              <p className={styles.__errors}>
                {errors.mail?.message}
                {emailExists && <span>Email déjà utilisé</span>}
              </p>
            </div>
            <div className={styles.form__group}>
              <label className={styles.label} htmlFor="name">
                Identifiant utilisateur :
              </label>
              <input
                type="text"
                {...register('siteIdentifier')}
                id="identifiant"
                autoCorrect="true"
                style={{ textTransform: 'lowercase' }}
                onBlur={() => refetchUsername()}
                disabled={contact.userId ? true : false}
              />
              <p className={styles.__errors}>** en miniscule **</p>
              <p className={styles.__errors}>
                {errors.siteIdentifier?.message}
                {usernameExists && <span>Identifiant déjà utilisé</span>}
              </p>
            </div>
            <div className={styles.form__group}>
              <label className={styles.label} htmlFor="pass">
                Mot de passe :
              </label>

              <input placeholder="********" type={showPassword ? 'text' : 'password'} {...register('pass')} id="pass" autoComplete="new-password" />
              <p className={styles.__errors}>{errors.pass?.message}</p>
              <div className={styles.icons}>
                <CgPassword onClick={onGeneratePassword} />
                {!showPassword ? <FaEye onClick={() => setShowPassword(true)} /> : <FaEyeSlash onClick={() => setShowPassword(false)} />}
                {password && <CgCopy onClick={() => onCopyPassword()} />}
              </div>
            </div>

            {!passwordValidation.isValid && (
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
            <div className={styles.form__group}>
              <label className={styles.label} htmlFor="confirm">
                Confirmer MDP :
              </label>
              <input placeholder="********" type={showConfirmPassword ? 'text' : 'password'} {...register('confirm')} id="confirm" autoCorrect="true" />
              <p className={styles.__errors}>{errors.confirm?.message}</p>

              <div className={styles.icons}>
                {!showConfirmPassword ? <FaEye onClick={() => setShowConfirmPassword(true)} /> : <FaEyeSlash onClick={() => setShowConfirmPassword(false)} />}
              </div>
            </div>
            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
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
      </div>
    </ReactModal>
  );
}
