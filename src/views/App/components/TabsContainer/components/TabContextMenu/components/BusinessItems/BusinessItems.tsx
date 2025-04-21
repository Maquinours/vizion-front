import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useMatch } from '@tanstack/react-router';
import { BeatLoader } from 'react-spinners';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';
import styles from './BusinessItems.module.scss';
import AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentBusinessAssistanceItemsComponent from './components/BusinessAssistancesItems/BusinessAssistancesItems';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import classNames from 'classnames';

type ItemProps = Readonly<{
  business: BusinessResponseDto;
}>;

function DashboardItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId/dashboard',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="dashboard" disabled={!!match} className={styles.item}>
      <Link
        to="/app/businesses-rma/business/$businessId/dashboard"
        params={{ businessId: business.id }}
        disabled={!!match}
        preload="intent"
        className="flex h-full w-full"
      >
        <span className={styles.text}>Tableau de bord</span>
      </Link>
    </MenuItem>
  );
}

function QuotationItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId/quotation',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="quotation" disabled={!!match} className={styles.item}>
      <Link to="/app/businesses-rma/business/$businessId/quotation" params={{ businessId: business.id }} preload="intent" className="flex h-full w-full">
        <span className={styles.text}>Devis</span>
      </Link>
    </MenuItem>
  );
}

function ArcItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId/arc',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="arc" disabled={!!match} className={styles.item}>
      <Link to="/app/businesses-rma/business/$businessId/arc" params={{ businessId: business.id }} preload="intent" className="flex h-full w-full">
        <span className={styles.text}>ARC</span>
      </Link>
    </MenuItem>
  );
}

function BpItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId/bp',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="bp" disabled={!!match} className={styles.item}>
      <Link to="/app/businesses-rma/business/$businessId/bp" params={{ businessId: business.id }} preload="intent" className="flex h-full w-full">
        <span className={styles.text}>BP</span>
      </Link>
    </MenuItem>
  );
}

function BlItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId/bl',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="bl" disabled={!!match} className={styles.item}>
      <Link to="/app/businesses-rma/business/$businessId/bl" params={{ businessId: business.id }} preload="intent" className="flex h-full w-full">
        <span className={styles.text}>BL</span>
      </Link>
    </MenuItem>
  );
}

function BillItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId/bill',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="bill" disabled={!!match} className={styles.item}>
      <Link to="/app/businesses-rma/business/$businessId/bill" params={{ businessId: business.id }} preload="intent" className="flex h-full w-full">
        <span className={styles.text}>Facture</span>
      </Link>
    </MenuItem>
  );
}

function StudyItem({ business }: ItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId_/study',
    select: (match) => match.params.businessId === business.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key="study" disabled={!!match} className={styles.item}>
      <Link to="/app/businesses-rma/business/$businessId/study" params={{ businessId: business.id }} preload="intent" className="flex h-full w-full">
        <span className={styles.text}>Synoptique</span>
      </Link>
    </MenuItem>
  );
}

function Separator() {
  return (
    <MenuItem disabled className={styles.item}>
      <div className="flex w-full flex-col justify-center">
        <span className="h-0 w-full border-b border-b-[var(--primary-color)] py-0.5"></span>
        <span className="h-0 py-0.5"></span>
      </div>
    </MenuItem>
  );
}

type AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentsProps = Readonly<{
  businessId: string;
}>;

export default function AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponent({
  businessId,
}: AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentsProps) {
  const { data: business, isLoading: isLoadingBusiness } = useQuery(queries.businesses.detail._ctx.byId(businessId));

  if (isLoadingBusiness)
    return (
      <MenuItem className={classNames(styles.item, styles.loader)}>
        <BeatLoader size={8} color="#16204e" speedMultiplier={0.5} />
      </MenuItem>
    );

  if (!business) return;
  const result = [];

  const state = business.oldState ?? business.state;

  if (state) {
    if ([BusinessState.CREATED, BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE].includes(state))
      result.push(<DashboardItem business={business} />);
    if ([BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE].includes(state))
      result.push(<QuotationItem business={business} />);
    if ([BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE].includes(state)) result.push(<ArcItem business={business} />);
    if ([BusinessState.BP, BusinessState.BL, BusinessState.FACTURE].includes(state)) result.push(<BpItem business={business} />);
    if ([BusinessState.BL, BusinessState.FACTURE].includes(state)) result.push(<BlItem business={business} />);
    if ([BusinessState.FACTURE].includes(state)) result.push(<BillItem business={business} />);
  }

  return [
    <Separator />,
    result,
    <StudyItem business={business} />,
    <AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentBusinessAssistanceItemsComponent business={business} />,
  ];
}
