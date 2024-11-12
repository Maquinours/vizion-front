import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Sidebar.module.scss';
import { ToPathOption } from '@tanstack/react-router';
import AssistanceState from '../../../../../../utils/enums/AssistanceState';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId');

const STEPS_DATA: Array<{
  label: string;
  link: ToPathOption;
  clickableStates: Array<AssistanceState>;
}> = [
  {
    label: 'Prise en charge',
    link: '/app/businesses-rma/rma/$rmaId/support',
    clickableStates: [AssistanceState.PRISE_EN_CHARGE, AssistanceState.RECEPTION, AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE],
  },
  {
    label: 'Réception du produit',
    link: '/app/businesses-rma/rma/$rmaId/reception',
    clickableStates: [AssistanceState.RECEPTION, AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE],
  },
  {
    label: 'Analyse/Réparation/Expédition',
    link: '/app/businesses-rma/rma/$rmaId/delivery',
    clickableStates: [AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE],
  },
];

export default function AppViewRmaViewSidebarComponent() {
  const { data: authentifiedUser } = useAuthentifiedUserQuery();
  const { rmaId } = routeApi.useParams();
  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        <div className={styles.step_progress}>
          {STEPS_DATA.map((stepData) => (
            <Link
              key={stepData.link}
              to={stepData.link}
              disabled={!stepData.clickableStates.includes(rma.state)}
              activeProps={{ className: styles.isActive }}
              replace
              className={styles.step}
            >
              <strong>{stepData.label}</strong>
            </Link>
          ))}
        </div>
      </div>
      {authentifiedUser.userInfo.roles.find((role) => ['ROLE_VIZEO', 'ROLE_DIRECTION_VIZEO', 'ROLE_STAGIAIRE_VIZEO'].includes(role)) &&
        rma.state !== AssistanceState.ARCHIVE && (
          <Link to="." search={(old) => ({ ...old, rmaModal: 'archive' })} replace resetScroll={false} className="btn btn-primary">
            Archiver
          </Link>
        )}
    </div>
  );
}
