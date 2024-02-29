import { MdOutlineAlternateEmail } from 'react-icons/md';
import styles from './ForgotPassword.module.scss';
import { Link } from '@tanstack/react-router';
import { InferType, object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { initializeResetPassword } from './api/password';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { PulseLoader } from 'react-spinners';

const yupSchema = object({
  email: string().email("Le format de l'addresse email est invalide").required("L'addresse email est requis."),
});

export default function ForgotPasswordPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }: InferType<typeof yupSchema>) => initializeResetPassword(email),
    onSuccess: () => {
      toast.success('Veuillez suivre les instructions envoyées par mail pour réinitialiser votre mot de passe');
    },
    onError: (error) => {
      if (
        isAxiosError(error) &&
        (error.response?.data.error === "Cette adresse e-mail n'existe pas!" ||
          error.response?.data.error === 'Aucun compte utilisateur associé à cette adresse e-mail!')
      )
        toast.error("Il n'existe aucun compte associé à cette adresse email");
      else {
        console.error(error);
        toast.error("Une erreur est survenue lors de l'envoi de la demande de réinitialisation de mot de passe");
      }
    },
  });

  return (
    <div className={styles.card_section}>
      <div className={styles.card}>
        <div className={styles.card_container}>
          <div className={styles.card_title}>
            <p>Réinitialisation de mot de passe</p>
          </div>

          <div className={styles.card_input}>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
              <div className={styles.form_group}>
                <span>
                  <MdOutlineAlternateEmail />
                </span>
                <input id="email" type="email" autoComplete="off" placeholder="Email" {...register('email')} />
                <p className={styles.__errors}>{errors.email?.message}</p>
              </div>

              {isPending && (
                <div className={styles.loader}>
                  <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
                </div>
              )}

              <div className={styles.buttons_container}>
                <button type="submit">Recupérer mon mot de passe</button>
                <Link to="/auth/login">Revenir à la connexion</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
