import TechnicalSupportResponseDto from '../../../../utils/types/TechnicalSupportResponseDto';
import CardComponent from '../../../Card/Card';
import styles from './SubtitleCard.module.scss';

type AppViewAssistanceViewSubTitleCardProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
  onEditButtonClick: () => void;
}>;
export default function AppViewAssistanceViewSubTitleCard({ assistance, onEditButtonClick }: AppViewAssistanceViewSubTitleCardProps) {
  return (
    <CardComponent
      title="Sous nom de l'affaire"
      onEdit={onEditButtonClick}
      // editLink={{
      //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/edit-subtitle',
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      //   preload: 'intent',
      // }}
      className={styles.card}
    >
      <div className={styles.text}>{assistance.name}</div>
    </CardComponent>
  );
}
