// import { Link } from '@tanstack/react-router';
import moment from 'moment';
// import { HiPencilAlt } from 'react-icons/hi';
import { MdSchedule } from 'react-icons/md';
import styles from './Informations.module.scss';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
// import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';

// const routePath = '/app/enterprises/$enterpriseId';

type EnterpriseModalComponentHeaderComponentInformationsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
}>;
export default function EnterpriseModalComponentHeaderComponentInformationsComponent({
  enterprise,
}: EnterpriseModalComponentHeaderComponentInformationsComponentProps) {
  // const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <div className={styles.container}>
      <div className={styles.representative_name}>
        <p>
          Représentant :{' '}
          <span>
            {enterprise.infoSup?.representative?.name ?? 'Aucun représentant'}{' '}
            {/* {currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <Link from={routePath} to="./update-representative" search replace resetScroll={false} preload="intent">
                <HiPencilAlt />
              </Link>
            )} */}
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
