import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, ToPathOption, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../utils/enums/BusinessState';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Sidebar.module.scss';
import { useMemo } from 'react';

const stepsData: Array<{
  label: string;
  link: ToPathOption;
  clickableStates: Array<BusinessState>;
}> = [
  {
    label: 'Tableau de bord',
    link: '/app/businesses-rma/business/$businessId/dashboard',
    clickableStates: [BusinessState.CREATED, BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Devis',
    link: '/app/businesses-rma/business/$businessId/quotation',
    clickableStates: [BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Accusé de réception de commande',
    link: '/app/businesses-rma/business/$businessId/arc',
    clickableStates: [BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Bon de préparation',
    link: '/app/businesses-rma/business/$businessId/bp',
    clickableStates: [BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  { label: 'Bon de livraison', link: '/app/businesses-rma/business/$businessId/bl', clickableStates: [BusinessState.BL, BusinessState.FACTURE] },
  { label: 'Facture', link: '/app/businesses-rma/business/$businessId/bill', clickableStates: [BusinessState.FACTURE] },
];

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewSidebarComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const state = useMemo(() => business.oldState ?? business.state, [business.oldState, business.state]);

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        <div className={styles.step_progress}>
          {stepsData.map((stepData) => (
            <Link
              key={stepData.link}
              to={stepData.link}
              disabled={!state || !stepData.clickableStates.includes(state)}
              className={styles.step}
              activeProps={{ className: styles.isActive }}
              replace
            >
              <strong>{stepData.label}</strong>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <Link disabled={business.state === BusinessState.DEVIS} search={(old) => ({ ...old, businessModal: 'assistances' })} replace className="btn btn-primary">
            Assistance
          </Link>
        )}
        {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <Link search={(old) => ({ ...old, businessModal: 'archive' })} replace className="btn btn-primary">
            Archiver
          </Link>
        )}
      </div>
    </div>
  );
}
