import { Link } from '@tanstack/react-router';
import moment from 'moment';
import { HiPencilAlt } from 'react-icons/hi';
import { MdSchedule } from 'react-icons/md';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Informations.module.scss';

const routePath = '/app/enterprises/$enterpriseId';

type AppViewEnterpriseViewHeaderComponentInformationsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
}>;
export default function AppViewEnterpriseViewHeaderComponentInformationsComponent({
  enterprise,
}: AppViewEnterpriseViewHeaderComponentInformationsComponentProps) {
  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <div className={styles.container}>
      <div className={styles.representative_name}>
        <p>
          Représentant :{' '}
          <span>
            {enterprise.infoSup?.representative?.name ?? 'Aucun représentant'}{' '}
            {currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <Link from={routePath} to="./update-representative" search replace resetScroll={false} preload="intent">
                <HiPencilAlt />
              </Link>
            )}
          </span>
        </p>
      </div>
      <div className={styles.last_update}>
        <p>Dernière date de modification {moment(enterprise.modifiedDate).format('DD-MM-YYYY HH:mm')}</p>
        <MdSchedule />
      </div>
    </div>
  );
}
