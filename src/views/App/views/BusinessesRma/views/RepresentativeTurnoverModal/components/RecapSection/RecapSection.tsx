import { useMemo } from 'react';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import SalesVvaResponseDto from '../../../../../../../../utils/types/SalesVvaResponseDto';
import styles from './RecapSection.module.scss';

type AppViewBusinessesRmaViewRepresentativeTurnoverModalViewRecapSectionComponentProps = Readonly<{
  data: Array<SalesVvaResponseDto> | undefined;
}>;
export default function AppViewBusinessesRmaViewRepresentativeTurnoverModalViewRecapSectionComponent({
  data,
}: AppViewBusinessesRmaViewRepresentativeTurnoverModalViewRecapSectionComponentProps) {
  const totalHT = useMemo(() => data?.reduce((prev, curr) => prev + curr.amountHt, 0) ?? 0, [data]);
  const commission = useMemo(() => totalHT * 0.08, [totalHT]);

  return (
    <div className={styles.recap_container}>
      <div className={styles.recap_content}>
        <div className={styles.details}>
          <div className={styles.title}>TOTAL du mois :</div>
          <CurrencyFormat value={totalHT} className={styles.content} />
        </div>
        <div className={styles.details}>
          <div className={styles.title}>Commission 8% :</div>
          <CurrencyFormat value={commission} className={styles.content} />
        </div>
      </div>
    </div>
  );
}
