import classNames from 'classnames';
import AssistanceState from '../../../../utils/enums/AssistanceState';
import AssistanceResponseDto from '../../../../utils/types/AssistanceResponseDto';
import styles from './Sidebar.module.scss';
import { RmaStep } from '../../utils/enums/RmaStep';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId');

const STEPS_DATA: Array<{
  label: string;
  step: RmaStep;
  clickableStates: Array<AssistanceState>;
}> = [
  {
    label: 'Prise en charge',
    step: RmaStep.SUPPORT,
    clickableStates: [AssistanceState.PRISE_EN_CHARGE, AssistanceState.RECEPTION, AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE],
  },
  {
    label: 'Réception du produit',
    step: RmaStep.RECEPTION,
    clickableStates: [AssistanceState.RECEPTION, AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE],
  },
  {
    label: 'Analyse/Réparation/Expédition',
    step: RmaStep.DELIVERY,
    clickableStates: [AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE],
  },
];

type RmaModalComponentSidebarComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  step: RmaStep;
  setStep: (step: RmaStep) => void;
}>;
export default function RmaModalComponentSidebarComponent({ rma, step, setStep }: RmaModalComponentSidebarComponentProps) {
  // const location = useLocation();

  // const { data: authentifiedUser } = useAuthentifiedUserQuery();
  // const { rmaId } = routeApi.useParams();
  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        <div className={styles.step_progress}>
          {STEPS_DATA.map((stepData) => (
            <button
              key={stepData.step}
              disabled={!stepData.clickableStates.includes(rma.state)}
              className={classNames(styles.step, { [styles.isActive]: stepData.step === step })}
              onClick={() => setStep(stepData.step)}
            >
              <strong>{stepData.label}</strong>
            </button>
            // <Link
            //   key={stepData.link}
            //   to={stepData.link}
            //   disabled={!stepData.clickableStates.includes(rma.state)}
            //   activeProps={{ className: styles.isActive }}
            //   replace
            //   className={styles.step}
            // >
            //   <strong>{stepData.label}</strong>
            // </Link>
          ))}
        </div>
      </div>
      {/* {authentifiedUser.userInfo.roles.find((role) => ['ROLE_VIZEO', 'ROLE_DIRECTION_VIZEO', 'ROLE_STAGIAIRE_VIZEO'].includes(role)) &&
        rma.state !== AssistanceState.ARCHIVE && (
          <Link to={location.pathname} search={(old) => ({ ...old, rmaModal: 'archive' })} replace resetScroll={false} className="btn btn-primary">
            Archiver
          </Link>
        )} */}
    </div>
  );
}
