import { Outlet } from '@tanstack/react-router';
import styles from './Auth.module.scss';
import Logo from '../../assets/images/logo-vizeo-fond-noir-centré.png';

export default function AuthLayout() {
  return (
    <>
      <div className={styles.background} />
      <main>
        <div className={styles.container}>
          <div className={styles.welcome_section}>
            <div className={styles.logo}>
              <img src={Logo} alt="Logo VIZEO" />
            </div>
            <div className={styles.text}>
              <p>Bienvenue sur Vizion</p>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </>
  );
}
