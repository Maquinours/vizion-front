import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { MdRefresh } from 'react-icons/md';
import styles from './Buttons.module.scss';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

type AppViewEnterpriseViewContactsComponentButtonsComponentProps = Readonly<{
  refetch: () => void;
}>;
export default function AppViewEnterpriseViewContactsComponentButtonsComponent({ refetch }: AppViewEnterpriseViewContactsComponentButtonsComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.buttons}>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <Link from={Route.id} to="./import-contacts" search={(old) => old} className="btn btn-primary">
          Importer des contacts
        </Link>
      )}
      <Link from={Route.id} to="./create-contact" search={(old) => old} className="btn btn-primary">
        Ajouter un contact
      </Link>

      <button className="btn btn-primary" onClick={() => refetch()}>
        <MdRefresh />
      </button>
    </div>
  );
}
