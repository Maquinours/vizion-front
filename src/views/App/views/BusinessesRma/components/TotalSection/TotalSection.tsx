import { useMemo } from 'react';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import styles from './TotalSection.module.scss';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import moment from 'moment';

type AppViewBusinessesRmaViewTotalSectionComponent = Readonly<{
  data: Array<AllBusinessResponseDto> | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
}>;
export default function AppViewBusinessesRmaViewTotalSectionComponent({ data, startDate, endDate }: AppViewBusinessesRmaViewTotalSectionComponent) {
  const hasCreditNotes = useMemo(
    () => data?.some((item) => item.category === CategoryBusiness.AFFAIRE && !!item.creditNotes && item.creditNotes.length > 0) ?? false,
    [data],
  );

  const totalAmount = useMemo(
    () =>
      data
        ?.filter((item) => item.category === CategoryBusiness.AFFAIRE)
        .reduce((prev, curr) => {
          const isCounted =
            startDate === undefined || endDate === undefined || curr.billDate === null || moment(curr.billDate).isBetween(startDate, endDate, 'day', '[]');
          return (
            prev +
            (isCounted ? (curr.totalHt ?? 0) : 0) -
            (curr.creditNotes?.reduce((prev, curr) => {
              const isCounted =
                startDate === undefined ||
                endDate === undefined ||
                curr.createdDate === null ||
                moment(curr.createdDate).isBetween(startDate, endDate, 'day', '[]');
              return prev + (isCounted ? (curr.totalAmountHT ?? 0) : 0);
            }, 0) ?? 0)
          );
        }, 0) ?? 0,
    [data, startDate, endDate],
  );

  return (
    <div id="all-business-total-container" className={styles.total_container}>
      <div className={styles._content}>
        <div>TOTAL de la sélection{hasCreditNotes ? ' (dont avoirs)' : ''} :</div>
        <div>
          <CurrencyFormat value={totalAmount} />
        </div>
      </div>
    </div>
  );
}
