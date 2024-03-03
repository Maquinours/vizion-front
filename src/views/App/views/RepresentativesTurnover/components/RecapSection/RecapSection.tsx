import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import SalesVvaResponseDto from '../../../../../../utils/types/SalesVvaResponseDto';
import styles from './RecapSection.module.scss';

const COMMISSION_RATE = 0.08;

type RepresentativesTurnoverViewRecapSectionComponentProps = Readonly<{
  data: Array<SalesVvaResponseDto> | undefined;
}>;
export default function RepresentativesTurnoverViewRecapSectionComponent({ data }: RepresentativesTurnoverViewRecapSectionComponentProps) {
  const totalHt = data?.reduce((acc, cur) => acc + cur.amountHt, 0) ?? 0;
  const commission = totalHt * COMMISSION_RATE;

  return (
    <div className={styles.recap_container}>
      <div className={styles.recap_content}>
        <div className={styles.details}>
          <div className={styles.title}>TOTAL du mois :</div>
          <CurrencyFormat className={styles.content} value={totalHt} />
        </div>
        <div className={styles.details}>
          <div className={styles.title}>Commission 8% :</div>
          <CurrencyFormat className={styles.content} value={commission} />
        </div>
      </div>
    </div>
  );
}
