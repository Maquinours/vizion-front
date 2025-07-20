import classNames from 'classnames';
import { useMemo } from 'react';
import { useWindowSize } from 'usehooks-ts';
import BusinessState from '../../../../utils/enums/BusinessState';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../views/App/utils/functions/getAuthentifiedUser';
import { BusinessStep } from '../../utils/enums/BusinessStep';
import styles from './Sidebar.module.scss';

const stepsData: Array<{
  label: string;
  smallLabel?: string;
  step: BusinessStep;
  clickableStates: Array<BusinessState>;
}> = [
  {
    label: 'Tableau de bord',
    smallLabel: 'Création',
    step: BusinessStep.DASHBOARD,
    clickableStates: [BusinessState.CREATED, BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Devis',
    step: BusinessStep.QUOTATION,
    clickableStates: [BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Accusé de réception de commande',
    smallLabel: 'ARC',
    step: BusinessStep.ARC,
    clickableStates: [BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Bon de préparation',
    smallLabel: 'BP',
    step: BusinessStep.BP,
    clickableStates: [BusinessState.BP, BusinessState.BL, BusinessState.FACTURE],
  },
  {
    label: 'Bon de livraison',
    smallLabel: 'BL',
    step: BusinessStep.BL,
    clickableStates: [BusinessState.BL, BusinessState.FACTURE],
  },
  { label: 'Facture', step: BusinessStep.BILL, clickableStates: [BusinessState.FACTURE] },
];

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId');

type BusinessModalComponentSidebarComponentProps = Readonly<{
  business: BusinessResponseDto;
  step: BusinessStep;
  setStep: (step: BusinessStep) => void;
  onAssistanceButtonClick: () => void;
  onArchiveButtonClick: () => void;
}>;
export default function BusinessModalComponentSidebarComponent({
  business,
  step,
  setStep,
  onAssistanceButtonClick,
  onArchiveButtonClick,
}: BusinessModalComponentSidebarComponentProps) {
  // const location = useLocation(); // We need to use useLocation to trigger a rerender of the links when the user navigates

  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { width: windowWidth } = useWindowSize();

  const state = useMemo(() => business.oldState ?? business.state, [business.oldState, business.state]);

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        <div className={styles.step_progress}>
          {stepsData.map((stepData) => {
            const disabled = !state || !stepData.clickableStates.includes(state);
            return (
              <button
                key={stepData.step}
                onClick={() => setStep(stepData.step)}
                disabled={disabled}
                className={classNames(styles.step, { [styles.isClickable]: !disabled, [styles.isActive]: step === stepData.step })}
              >
                <strong>{!!windowWidth && windowWidth < 992 && !!stepData.smallLabel ? stepData.smallLabel : stepData.label}</strong>
              </button>
            );
            // return (
            //   <Link
            //     key={stepData.link}
            //     to={stepData.link}
            //     disabled={disabled}
            //     className={classNames(styles.step, { [styles.isClickable]: !disabled })}
            //     activeProps={{ className: styles.isActive }}
            //     replace
            //   >
            //     <strong>{!!windowWidth && windowWidth < 992 && !!stepData.smallLabel ? stepData.smallLabel : stepData.label}</strong>
            //   </Link>
            // );
          })}
        </div>
      </div>
      <div className={styles.buttons}>
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <button type="button" className="btn btn-primary" onClick={onAssistanceButtonClick}>
            {/* <Link
              to={location.pathname}
              search={(old) => ({ ...old, businessModal: 'assistances' })}
              replace
              resetScroll={false}
              preload="intent"
              ignoreBlocker
              className="btn btn-primary"
            > */}
            Assistance
            {/* </Link> */}
          </button>
        )}
        {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && business.state !== BusinessState.ARCHIVE && (
          <button type="button" className="btn btn-primary" onClick={onArchiveButtonClick}>
            {/* <Link
            to={location.pathname}
            search={(old) => ({ ...old, businessModal: 'archive' })}
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
            className="btn btn-primary"
          > */}
            Archiver
            {/* </Link> */}
          </button>
        )}
      </div>
    </div>
  );
}
