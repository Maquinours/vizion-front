import { MdPerson, MdPowerSettingsNew } from 'react-icons/md';
import styles from './BasicTopbar.module.scss';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';

type AppLayoutTopbarComponentBasicTopbarComponentProps = {
  logout: () => void;
};
export default function AppLayoutTopbarComponentBasicTopbarComponent({ logout }: Readonly<AppLayoutTopbarComponentBasicTopbarComponentProps>) {
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
        <div className={styles.email}></div>

        <div className={styles.icons}>
          <button className={styles.icon} onClick={logout}>
            <MdPowerSettingsNew className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
}
