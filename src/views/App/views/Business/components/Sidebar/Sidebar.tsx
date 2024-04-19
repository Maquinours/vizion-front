import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Sidebar.module.scss';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { Link, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import BusinessState from '../../../../../../utils/enums/BusinessState';

const stepsData = [
  {
    label: 'Tableau de bord',
    link: 'dashboard',
    clickableStates: [BusinessState.CREATED, BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Devis',
    link: 'quotation',
    clickableStates: [BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Accusé de réception de commande',
    link: 'arc',
    clickableStates: [BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  { label: 'Bon de préparation', link: 'bp', clickableStates: [BusinessState.BP, BusinessState.BL, BusinessState.FACTURE] },
  { label: 'Bon de livraison', link: 'bl', clickableStates: [BusinessState.BL, BusinessState.FACTURE] },
  { label: 'Facture', link: 'bill', clickableStates: [BusinessState.FACTURE] },
];

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewSidebarComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        <div className={styles.step_progress}>
          {stepsData.map((stepData) => (
            <Link
              key={stepData.link}
              from={routeApi.id}
              to={stepData.link}
              params={(old) => old}
              search={(old) => old}
              className={classNames(styles.step, {
                [styles.isClickable]: business.state && stepData.clickableStates.includes(business.state),
              })}
              activeProps={{ className: styles.isActive }}
            >
              <strong>{stepData.label}</strong>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <Link search={(old) => ({ ...old, businessModal: 'assistances' })} className="btn btn-primary">
            Assistance
          </Link>
        )}
        {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <Link search={(old) => ({ ...old, businessModal: 'archive' })} className="btn btn-primary">
            Archiver
          </Link>
        )}
      </div>
    </div>
  );
}
