import TechnicalSupportResponseDto from '../../../../utils/types/TechnicalSupportResponseDto';
import CardComponent from '../../../Card/Card';
import styles from './TitleCard.module.scss';

type AssistanceModalComponentTitleCardComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AssistanceModalComponentTitleCardComponent({ assistance }: AssistanceModalComponentTitleCardComponentProps) {
  return (
    <CardComponent className={styles.card} title="Nom de l'affaire">
      <div className={styles.text}>{assistance.businessTitle}</div>
    </CardComponent>
  );
}
