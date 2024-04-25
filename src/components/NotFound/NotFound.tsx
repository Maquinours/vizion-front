import Logo from '../../assets/images/logo-vizeo-fond-blanc-centré.png';
import { Link } from '@tanstack/react-router';
import styles from './NotFound.module.scss';

export default function NotFoundComponent() {
  return (
    <div className={styles.pnf_container}>
      <div className={styles.pnf_content}>
        <div className={styles.pnf_content_error}>
          <img src={Logo} alt="forgot__vizion_logo" />
          <h1>OOPS !</h1>
          <h2 style={{ bottom: '-2rem' }}>404 - Cette page ne peut être trouvée</h2>
        </div>
        <Link to="/">Retour</Link>
      </div>
    </div>
  );
}
