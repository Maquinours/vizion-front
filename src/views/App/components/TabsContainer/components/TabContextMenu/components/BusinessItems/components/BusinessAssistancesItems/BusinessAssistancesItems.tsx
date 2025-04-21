import { useQuery } from '@tanstack/react-query';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../../../utils/enums/CategoryBusiness';
import { MenuItem } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { Link } from '@tanstack/react-router';
import styles from './BusinessAssistancesItems.module.scss';
import TechnicalSupportResponseDto from '../../../../../../../../../../utils/types/TechnicalSupportResponseDto';
import { useMatch } from '@tanstack/react-router';
import classNames from 'classnames';

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

type AssistanceItemProps = Readonly<{
  business: BusinessResponseDto;
  assistance: TechnicalSupportResponseDto;
}>;
function AssistanceItem({ business, assistance }: AssistanceItemProps) {
  const match = useMatch({
    from: '/app/businesses-rma_/business/$businessId_/assistance/$assistanceId',
    select: (match) => match.params.businessId === business.id && match.params.assistanceId === assistance.id,
    shouldThrow: false,
  });

  return (
    <MenuItem key={assistance.id} disabled={!!match} className={styles.item}>
      <Link
        to="/app/businesses-rma/business/$businessId/assistance/$assistanceId"
        params={{ businessId: business.id, assistanceId: assistance.id }}
        preload="intent"
        className="flex h-full w-full"
      >
        <span className={styles.text}>Assistance {assistance.name?.trim() || 'sans nom'}</span>
      </Link>
    </MenuItem>
  );
}

type AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentBusinessAssistanceItemsComponentProps = Readonly<{
  business: BusinessResponseDto;
}>;
export default function AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentBusinessAssistanceItemsComponent({
  business,
}: AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponentBusinessAssistanceItemsComponentProps) {
  const { data: assistances, isLoading: isLoadingAssistances } = useQuery(
    queries['technical-supports'].list._ctx.byBusinessOrRmaNumber({ categoryBusiness: CategoryBusiness.AFFAIRE, number: business.numBusiness }),
  );

  if (isLoadingAssistances)
    return (
      <MenuItem className={classNames(styles.item, styles.loader)}>
        <BeatLoader size={8} color="#16204e" speedMultiplier={0.5} />
      </MenuItem>
    );

  if (!business) return;

  const result = assistances?.map((assistance) => <AssistanceItem key={assistance.id} business={business} assistance={assistance} />);

  if (!result || result.length === 0) return;

  return [<Separator />, ...result];
}
