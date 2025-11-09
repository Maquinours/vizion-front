import { Link, useLocation } from '@tanstack/react-router';
import { MdPerson, MdPowerSettingsNew } from 'react-icons/md';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './BasicTopbar.module.scss';
import AppLayoutTopbarComponentBasicTopbarComponentAircallUsersComponent from './components/AircallUsers/AircallUsers';
import AppLayoutTopbarComponentBasicTopbarComponentSearchFieldsComponent from './components/SearchFields/SearchFields';

type AppLayoutTopbarComponentBasicTopbarComponentProps = {
  logout: () => void;
};
export default function AppLayoutTopbarComponentBasicTopbarComponent({ logout }: Readonly<AppLayoutTopbarComponentBasicTopbarComponentProps>) {
  const location = useLocation(); // We need to use useLocation to trigger a rerender of the link when the user navigates
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
        {currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppLayoutTopbarComponentBasicTopbarComponentAircallUsersComponent />}
        <a href="https://vizia.vizeo.eu/VF/admin/" target="_blank" rel="noreferrer" className="btn btn-primary-light">
          Admin chatbot
        </a>
      </div>

      {currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppLayoutTopbarComponentBasicTopbarComponentSearchFieldsComponent />}

      <div className={styles.right}>
        <div className={styles.version}>
          {import.meta.env.VITE_REACT_APP_VERSION}
          {import.meta.env.DEV && '-DEV'}
        </div>
        {currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
          <div className={styles.email}>
            <Link to={location.pathname} search={(old) => ({ ...old, appModal: 'send-email' })} replace preload="intent" resetScroll={false}>
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
