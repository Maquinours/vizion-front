import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import TechnicalSupportResponseDto from '../../../../utils/types/TechnicalSupportResponseDto';
import LifesheetComponent from '../../../Lifesheet/Lifesheet';
import styles from './Lifesheet.module.scss';

type AppViewAssistanceViewLifesheetComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
  onCreateButtonClick: () => void;
}>;
export default function AppViewAssistanceViewLifesheetComponent({ assistance, onCreateButtonClick }: AppViewAssistanceViewLifesheetComponentProps) {
  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.ASSISTANCE}
      associatedItemId={assistance.id}
      page={0}
      size={100}
      className={styles.card}
      onCreateClick={onCreateButtonClick}
      // createLink={{ to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-lifesheet', search: true, replace: true, resetScroll: false }}
      // getEmailLink={(data) => ({
      //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/lifesheet-email/$lifesheetId',
      //   params: { lifesheetId: data.id },
      //   search: true,
      // })}
    />
  );
}
