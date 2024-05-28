import LifesheetComponent from '../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';
import TechnicalSupportResponseDto from '../../../../../../utils/types/TechnicalSupportResponseDto';
import styles from './Lifesheet.module.scss';

type AppViewAssistanceViewLifesheetComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AppViewAssistanceViewLifesheetComponent({ assistance }: AppViewAssistanceViewLifesheetComponentProps) {
  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.ASSISTANCE}
      associatedItemId={assistance.id}
      page={0}
      size={100}
      className={styles.card}
      createLink={{ to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-lifesheet', replace: true, resetScroll: false }}
    />
  );
}
