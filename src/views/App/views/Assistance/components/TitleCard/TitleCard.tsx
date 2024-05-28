import CardComponent from '../../../../../../components/Card/Card';
import TechnicalSupportResponseDto from '../../../../../../utils/types/TechnicalSupportResponseDto';
import styles from './TitleCard.module.scss';

type AppViewAssistanceViewTitleCardComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AppViewAssistanceViewTitleCardComponent({ assistance }: AppViewAssistanceViewTitleCardComponentProps) {
  return (
    <CardComponent className={styles.card} title="Nom de l'affaire">
      <div className={styles.text}>{assistance.businessTitle}</div>
    </CardComponent>
  );
}
