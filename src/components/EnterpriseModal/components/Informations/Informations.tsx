import { HiPencilAlt } from 'react-icons/hi';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import { useAuthentifiedUserQuery } from '../../../../views/App/utils/functions/getAuthentifiedUser';
import CardComponent from '../../../Card/Card';
import styles from './Informations.module.scss';

// const routePath = '/app/enterprises/$enterpriseId';

type EnterpriseComponentInformationsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onEditEnterpriseClick: () => void;
  onUpdateAccountabilityClick: () => void;
}>;
export default function EnterpriseComponentInformationsComponent({
  enterprise,
  onEditEnterpriseClick,
  onUpdateAccountabilityClick,
}: EnterpriseComponentInformationsComponentProps) {
  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <CardComponent
      title="Informations de l'entreprise"
      onEdit={onEditEnterpriseClick}
      // editLink={
      //   currentUser.userInfo.roles.some(
      //     (role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role) && !currentUser.userInfo.roles.includes('ROLE_STAGIAIRE_VIZEO'),
      //   )
      //     ? { to: '/app/enterprises/$enterpriseId/update', params: { enterpriseId: enterprise.id }, search: true, replace: true, preload: 'intent' }
      //     : undefined
      // }
    >
      <div className={styles.container}>
        <div className={styles.detail}>
          <div className={styles.title}>Société :</div>
          <div className={styles.content}>{enterprise.name}</div>
        </div>
        <div className={styles.detail}>
          <div className={styles.title}>Enseigne :</div>
          <div className={styles.content}>{enterprise.sign}</div>
        </div>
        <div className={styles.detail}>
          <div className={styles.title}>Catégorie :</div>
          <div className={styles.content}>{enterprise.category}</div>
        </div>
        <div className={styles.detail}>
          <div className={styles.title}>Adresse :</div>
          <div className={styles.content}>{enterprise.addressLineOne}</div>
        </div>
        <div className={styles.detail}>
          <div className={styles.title}>CP + Ville :</div>
          <div className={styles.content}>
            {enterprise.zipCode} {enterprise.city}
          </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.title}>Remise :</div>
          <div className={styles.content}>
            {enterprise.accountability?.discount}{' '}
            {currentUser.userInfo.roles.some(
              (role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role) && !currentUser.userInfo.roles.includes('ROLE_STAGIAIRE_VIZEO'),
            ) && (
              <button type="button" onClick={onUpdateAccountabilityClick}>
                <HiPencilAlt className={styles.icon} />
              </button>
              // <Link from={routePath} to="./update-accountability" params={{ enterpriseId: enterprise.id }} search replace resetScroll={false}>
              //   <HiPencilAlt className={styles.icon} />
              // </Link>
            )}
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
