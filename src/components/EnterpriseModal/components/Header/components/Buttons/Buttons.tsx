import { Link } from '@tanstack/react-router';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import styles from './Buttons.module.scss';

// const routePath = '/app/enterprises/$enterpriseId';

type EnterpriseModalComponentHeaderComponentButtonsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onEmailHistoryClick: () => void;
}>;
export default function EnterpriseModalComponentHeaderComponentButtonsComponent({
  enterprise,
  onEmailHistoryClick,
}: EnterpriseModalComponentHeaderComponentButtonsComponentProps) {
  // const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <div className={styles.container}>
      <Link to="/app/enterprises/$enterpriseId" params={{ enterpriseId: enterprise.id}} search={{ fromCall: true }} className="btn btn-secondary">
        Ouvrir l&apos;entreprise
      </Link>
      <button className="btn btn-primary" onClick={onEmailHistoryClick}>
        Historique des mails
      </button>
      {/* <Link from={routePath} to="email-history" search replace resetScroll={false} preload="intent" className="btn btn-primary">
        Historique des mails
      </Link> */}
      {/* <Link
        from={routePath}
        to="./address-book"
        search={(old) => ({ ...old, search: undefined, page: 0, size: 9 })}
        replace
        resetScroll={false}
        preload="intent"
        className="btn btn-primary"
      >
        {"Carnet d'adresse"}
      </Link> */}
      {/* {currentUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
        <Link from={routePath} to="./delete" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Supprimer cette entreprise
        </Link>
      )} */}
    </div>
  );
}
