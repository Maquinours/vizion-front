// import { Link } from '@tanstack/react-router';
import { MdRefresh } from 'react-icons/md';
import styles from './Buttons.module.scss';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';

// const routePath = '/app/enterprises/$enterpriseId';

type EnterpriseModalComponentContactsComponentButtonsComponentProps = Readonly<{
  refetch: () => void;
  onImportContactsClick: () => void;
  onCreateContactClick: () => void;
}>;
export default function EnterpriseModalComponentContactsComponentButtonsComponent({
  refetch,
  onImportContactsClick,
  onCreateContactClick,
}: EnterpriseModalComponentContactsComponentButtonsComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.buttons}>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <button type="button" className="btn btn-primary" onClick={onImportContactsClick}>
          Importer des contacts
        </button>
        // <Link from={routePath} to="./import-contacts" search replace resetScroll={false} preload="intent" className="btn btn-primary">
        //   Importer des contacts
        // </Link>
      )}
      <button type="button" className="btn btn-primary" onClick={onCreateContactClick}>
        Ajouter un contact
      </button>
      {/* <Link from={routePath} to="./create-contact" search replace resetScroll={false} preload="intent" className="btn btn-primary">
        Ajouter un contact
      </Link> */}

      <button className="btn btn-primary" onClick={() => refetch()}>
        <MdRefresh />
      </button>
    </div>
  );
}
