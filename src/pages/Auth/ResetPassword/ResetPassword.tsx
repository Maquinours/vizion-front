import { useState } from 'react';
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { object, ref, string } from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import styles from './ResetPassword.module.scss';
import { MdCheckCircleOutline, MdOutlineCancel } from 'react-icons/md';
import { PulseLoader } from 'react-spinners';
import { resetPassword } from './api/password';
import { isAxiosError } from 'axios';

const Route = getRouteApi('/auth/reset-password/$token');

const yupSchema = object({
  password: string()
    .typeError('')
    .required('Le mot de passe est requis')
    .matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]))(?=.*\d)((?=.*[a-z]))((?=.*[A-Z])).*$/, 'Format invalide'),
  confirm: string()
    .typeError('')
    .required('Confirmer le mot de passe')
    .oneOf([ref('password')], 'Mots de passe non identiques.'),
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showValidationRules, setShowValidationRules] = useState(false);
  const [validationRules, setValidationRules] = useState({
    length: false,
    upper: false,
    lower: false,
    special: false,
    number: false,
  });

  const { token } = Route.useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const checkPassword = (password: string) => {
    const lengthRegex = /^.*(?=.{8,}).*$/;
    const upper = /^(?=.*?[A-Z])/;
    const lower = /^(?=.*?[a-z])/;
    const special = /^(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/;
    const number = /^(?=.*?\d)/;
    const validationRules = {
      length: lengthRegex.test(password),
      upper: upper.test(password),
      lower: lower.test(password),
      special: special.test(password),
      number: number.test(password),
    };
    if (password) {
      if (!validationRules.length || !validationRules.upper || !validationRules.lower || !validationRules.special || !validationRules.number) {
        setShowValidationRules(true);
      } else {
        setShowValidationRules(false);
      }
    } else {
      setShowValidationRules(false);
    }
    setValidationRules(validationRules);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (password: string) => resetPassword(token, password),
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès, veuillez vous reconnecter');
      navigate({ to: '/auth/login' });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.data.error === 'Demande de réinitialisation de mot de passe non retrouvé! \n Merci de reprendre.')
          toast.error('Le lien de réinitialisation de mot de passe est invalide.');
        else if (error.response?.data.error === 'Demande de réinitialisation de mot de passe expirée! \n Merci de reprendre.')
          toast.error('Le lien de réinitialisation de mot de passe a expiré. Veuillez recommencer la procédure.');
        else {
          console.error(error);
          toast.error('Une erreur est survenue lors de la réinitialisation du mot de passe.');
        }
      } else {
        console.error(error);
        toast.error('Une erreur est survenue lors de la réinitialisation du mot de passe.');
      }
    },
  });

  return (
    <div className={styles.forgot__card_section}>
      <div className={styles.forgot__card}>
        <div className={styles.forgot__card__container}>
          <div className={styles.forgot__card_title}>
            <p>Réinitialisation de mot de passe</p>
          </div>

          <div className={styles.forgot__card_input}>
            <form className={styles.form} onSubmit={handleSubmit((data) => mutate(data.password))}>
              <div className={styles.form__group}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nouveau mot de passe"
                  {...register('password')}
                  onChange={(e) => checkPassword(e.target.value)}
                />
                {!showPassword ? <FaEye onClick={() => setShowPassword(true)} /> : <FaEyeSlash onClick={() => setShowPassword(false)} />}
                <p className={styles.__errors}>{errors.password?.message}</p>
              </div>
              <div className={styles.form__group}>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="off"
                  placeholder="Confirmation"
                  {...register('confirm')}
                  onPaste={(e) => e.preventDefault()}
                />
                <p className={styles.__errors}>{errors.confirm?.message}</p>
              </div>

              {showValidationRules && (
                <div className={styles.password_specifications}>
                  <p>Doit contenir au moins</p>
                  <ul>
                    <li>
                      {validationRules.length ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                      <span>8 caractères</span>
                    </li>
                    <li>
                      {validationRules.upper ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                      <span>une lettre majuscule (A-Z)</span>
                    </li>
                    <li>
                      {validationRules.lower ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                      <span>une lettre miniscule (a-z)</span>
                    </li>
                    <li>
                      {validationRules.number ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}

                      <span>un chiffre (0-9)</span>
                    </li>
                    <li className="mr-2">
                      {validationRules.special ? <MdCheckCircleOutline color="#31385A" /> : <MdOutlineCancel color="#F24C52" />}
                      <span>{'un caractere special ("#$%\'\\*+@...)'}</span>
                    </li>
                  </ul>
                </div>
              )}

              {isPending && (
                <div className={styles.form__loader}>
                  <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
                </div>
              )}

              <div className={styles.form__submit}>
                <Link to="/auth/login">Revenir à la connexion</Link>
                <button type="submit">Définir mon mot de passe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
