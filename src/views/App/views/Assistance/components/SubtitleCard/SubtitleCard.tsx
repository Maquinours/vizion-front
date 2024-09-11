import CardComponent from '../../../../../../components/Card/Card';
import TechnicalSupportResponseDto from '../../../../../../utils/types/TechnicalSupportResponseDto';
import styles from './SubtitleCard.module.scss';

type AppViewAssistanceViewSubTitleCardProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AppViewAssistanceViewSubTitleCard({ assistance }: AppViewAssistanceViewSubTitleCardProps) {
  return (
    <CardComponent
      title="Sous nom de l'affaire"
      editLink={{
        to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/edit-subtitle',
        search: true,
        replace: true,
        resetScroll: false,
        preload: 'intent',
      }}
      className={styles.card}
    >
      <div className={styles.text}>{assistance.name}</div>
    </CardComponent>
  );
}
