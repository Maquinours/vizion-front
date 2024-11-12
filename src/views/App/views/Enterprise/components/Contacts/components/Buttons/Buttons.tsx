import { Link } from '@tanstack/react-router';
import { MdRefresh } from 'react-icons/md';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Buttons.module.scss';

const routePath = '/app/enterprises/$enterpriseId';

type AppViewEnterpriseViewContactsComponentButtonsComponentProps = Readonly<{
  refetch: () => void;
}>;
export default function AppViewEnterpriseViewContactsComponentButtonsComponent({ refetch }: AppViewEnterpriseViewContactsComponentButtonsComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.buttons}>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <Link from={routePath} to="./import-contacts" search replace resetScroll={false} preload="intent" className="btn btn-primary">
          Importer des contacts
        </Link>
      )}
      <Link from={routePath} to="./create-contact" search replace resetScroll={false} preload="intent" className="btn btn-primary">
        Ajouter un contact
      </Link>

      <button className="btn btn-primary" onClick={() => refetch()}>
        <MdRefresh />
      </button>
    </div>
  );
}
