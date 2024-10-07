import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, ToPathOption, getRouteApi, useLocation } from '@tanstack/react-router';
import { useWindowSize } from 'usehooks-ts';
import { useMemo } from 'react';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../utils/enums/BusinessState';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Sidebar.module.scss';

const stepsData: Array<{
  label: string;
  smallLabel?: string;
  link: ToPathOption;
  clickableStates: Array<BusinessState>;
}> = [
  {
    label: 'Tableau de bord',
    smallLabel: 'Création',
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
    smallLabel: 'ARC',
    link: '/app/businesses-rma/business/$businessId/arc',
    clickableStates: [BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Bon de préparation',
    smallLabel: 'BP',
    link: '/app/businesses-rma/business/$businessId/bp',
    clickableStates: [BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Bon de livraison',
    smallLabel: 'BL',
    link: '/app/businesses-rma/business/$businessId/bl',
    clickableStates: [BusinessState.BL, BusinessState.FACTURE],
  },
  { label: 'Facture', link: '/app/businesses-rma/business/$businessId/bill', clickableStates: [BusinessState.FACTURE] },
];

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewSidebarComponent() {
  useLocation(); // We need to use useLocation to trigger a rerender of the links when the user navigates

  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { width: windowWidth } = useWindowSize();

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
              <strong>{!!windowWidth && windowWidth < 992 && !!stepData.smallLabel ? stepData.smallLabel : stepData.label}</strong>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <Link
            to="."
            search={(old) => ({ ...old, businessModal: 'assistances' })}
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
            className="btn btn-primary"
          >
            Assistance
          </Link>
        )}
        {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <Link
            to="."
            search={(old) => ({ ...old, businessModal: 'archive' })}
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
            className="btn btn-primary"
          >
            Archiver
          </Link>
        )}
      </div>
    </div>
  );
}
