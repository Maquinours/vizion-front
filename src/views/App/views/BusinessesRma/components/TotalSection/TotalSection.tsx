import { useMemo } from 'react';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import styles from './TotalSection.module.scss';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';

type AppViewBusinessesRmaViewTotalSectionComponent = Readonly<{
  data: Array<AllBusinessResponseDto> | undefined;
}>;
export default function AppViewBusinessesRmaViewTotalSectionComponent({ data }: AppViewBusinessesRmaViewTotalSectionComponent) {
  const hasCreditNotes = useMemo(
    () => data?.some((item) => item.category === CategoryBusiness.AFFAIRE && !!item.creditNotes && item.creditNotes.length > 0) ?? false,
    [data],
  );

  const totalAmount = useMemo(
    () =>
      data
        ?.filter((item) => item.category === CategoryBusiness.AFFAIRE)
        .reduce((prev, curr) => prev + (curr.totalHt ?? 0) - (curr.creditNotes?.reduce((prev, curr) => prev + (curr.totalAmountHT ?? 0), 0) ?? 0), 0) ?? 0,
    [data],
  );

  return (
    <div className={styles.total_container}>
      <div className={styles._content}>
        <div>TOTAL de la sélection{hasCreditNotes ? ' (dont avoirs)' : ''} :</div>
        <div>
          <CurrencyFormat value={totalAmount} />
        </div>
      </div>
    </div>
  );
}
