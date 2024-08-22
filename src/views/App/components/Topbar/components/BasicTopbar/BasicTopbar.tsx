import { MdPerson, MdPowerSettingsNew } from 'react-icons/md';
import styles from './BasicTopbar.module.scss';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { Link, useLocation } from '@tanstack/react-router';

type AppLayoutTopbarComponentBasicTopbarComponentProps = {
  logout: () => void;
};
export default function AppLayoutTopbarComponentBasicTopbarComponent({ logout }: Readonly<AppLayoutTopbarComponentBasicTopbarComponentProps>) {
  useLocation(); // We need to use useLocation to trigger a rerender of the link when the user navigates
  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            <MdPerson />
          </div>
          <div className={styles.infos}>
            {currentUser.profile.categoryClient === CategoryClient.REPRESENTANT ? (
              <span>{currentUser.profile.enterprise?.name}</span>
            ) : (
              <>
                <span>{currentUser.profile?.firstName}</span>
                <span>{currentUser.profile?.lastName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.version}>
          {import.meta.env.VITE_REACT_APP_VERSION}
          {import.meta.env.DEV && '-DEV'}
        </div>
        {currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
          <div className={styles.email}>
            <Link search={(old) => ({ ...old, appModal: 'send-email' })} replace preload="intent" resetScroll={false}>
              Écrire un mail
            </Link>
          </div>
        )}

        <div className={styles.icons}>
          <button className={styles.icon} onClick={logout}>
            <MdPowerSettingsNew className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
}
