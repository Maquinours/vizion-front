import { InferType, object, string } from 'yup';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdLock, MdPerson } from 'react-icons/md';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { SyncLoader } from 'react-spinners';
import { login } from './api/authentication';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Link } from '@tanstack/react-router';

const yupSchema = object({
  username: string().required("L'identifiant est requis."),
  password: string().required('Le mot de passe est requis'),
  // remember_me: boolean().required(), // TODO: implement this
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password }: InferType<typeof yupSchema>) => login(username, password),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.data.error === 'invalid_grant') toast.error('Identifiant ou mot de passe incorrect.');
        else {
          console.error(error);
          toast.error("Une erreur est survenue lors de l'authentification.");
        }
      }
    },
  });

  return (
    <div className={styles.card_section}>
      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.title}>
            <p>Connexion à Vizion</p>
          </div>
          <div className={styles.input_sections}>
            <form className={styles.form} onSubmit={handleSubmit((data) => mutate(data))}>
              <div className={styles.form_group}>
                <span>
                  <MdPerson />
                </span>
                <input {...register('username')} id="identifiant" className={styles.input} placeholder="Identifiant" type="text" />
                <p className={styles.__errors}>{errors.username?.message}</p>
              </div>
              <div className={styles.form_group}>
                <span>
                  <MdLock />
                </span>
                <input
                  {...register('password')}
                  id="password"
                  className={styles.input}
                  name="password"
                  placeholder="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                />
                <p className={styles.__errors}>{errors.password?.message}</p>
                {!showPassword ? <FaEye onClick={() => setShowPassword(!showPassword)} /> : <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />}
              </div>

              {/* <div className={styles.remember_me}>
                <input {...register('remember_me')} type="checkbox" id="remember_me" name="remember_me" />
                <label htmlFor="remember_me">Se souvenir de moi</label>
              </div> */}

              {isPending && (
                <div className={styles.request_loader}>
                  <SyncLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
                </div>
              )}

              <div className={styles.form_submit}>
                <button type="submit" disabled={isPending}>
                  Se connecter
                </button>
              </div>
            </form>
          </div>

          <div className={styles.card_forgot}>
            <Link to="/auth/forgot-password">Mot de passe oublié ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
