import { HiPencilAlt } from 'react-icons/hi';
import styles from './Informations.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import CardComponent from '../../../../../../components/Card/Card';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

type AppViewEnterpriseViewInformationsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
}>;
export default function AppViewEnterpriseViewInformationsComponent({ enterprise }: AppViewEnterpriseViewInformationsComponentProps) {
  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <CardComponent
      title="Informations de l'entreprise"
      editLink={
        currentUser.userInfo.roles.some(
          (role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role) && !currentUser.userInfo.roles.includes('ROLE_STAGIAIRE_VIZEO'),
        )
          ? { to: '/app/enterprises/$enterpriseId/update', params: { enterpriseId: enterprise.id }, search: (old) => old }
          : undefined
      }
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
              <Link from={Route.id} to="./update-accountability" params={{ enterpriseId: enterprise.id }} search={(old) => old} replace>
                <HiPencilAlt className={styles.icon} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
