import { useQuery } from '@tanstack/react-query';
import AllBusinessResponseDto from '../../../../../../../../../../utils/types/AllBusinessResponseDto';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessQuotationDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessQuotationDetailsResponseDto';
import AllBusinessState from '../../../../../../../../../../utils/enums/AllBusinessState';
import BillType from '../../../../../../../../../../utils/enums/BillType';
import { ClipLoader } from 'react-spinners';

type AppViewBusinessesRmaViewTableComponentRowTooltipComponentContentComponentProps = Readonly<{
  item: AllBusinessResponseDto;
}>;
export default function AppViewBusinessesRmaViewTableComponentRowTooltipComponentContentComponent({
  item,
}: AppViewBusinessesRmaViewTableComponentRowTooltipComponentContentComponentProps) {
  const { data: quotationData, isLoading: isLoadingQuotation } = useQuery({
    ...queries['business-quotations'].detail._ctx.byBusinessId(item.businessId),
    select: (data) =>
      data.subQuotationList
        ?.flatMap((subQuotation) => subQuotation.quotationDetails)
        .filter((detail): detail is BusinessQuotationDetailsResponseDto => !!detail && !!detail.quantity)
        .map((detail) => ({ id: detail.id, reference: detail.productReference, quantity: detail.quantity! })),
    enabled: item.state === AllBusinessState.DEVIS,
  });

  const { data: arcData, isLoading: isLoadingArc } = useQuery({
    ...queries['business-ARCs'].detail._ctx.byBusinessId(item.businessId),
    select: (data) => data.arcDetailsList?.map((detail) => ({ id: detail.id, reference: detail.productReference, quantity: detail.quantity })),
    enabled: item.state === AllBusinessState.ARC,
  });

  const { data: bpData, isLoading: isLoadingBp } = useQuery({
    ...queries['business-bps'].detail._ctx.byBusinessId(item.businessId),
    select: (data) =>
      data.bpDetailsList
        ?.filter((detail) => !!detail.quantity)
        .map((detail) => ({ id: detail.id, reference: detail.productReference, quantity: detail.quantity! })),
    enabled: item.state === AllBusinessState.BP,
  });

  const { data: blData, isLoading: isLoadingBl } = useQuery({
    ...queries['business-bls'].list._ctx.byBusinessId(item.businessId),
    select: (data) =>
      data
        .flatMap((bl) => bl.blDetailsList)
        .filter((detail) => !!detail.quantityDelivered)
        .map((detail) => ({ id: detail.id, reference: detail.productReference, quantity: detail.quantityDelivered! })),
    enabled: item.state === AllBusinessState.BL,
  });

  const { data: billData, isLoading: isLoadingBill } = useQuery({
    ...queries['business-bills'].list._ctx.byBusinessId(item.businessId),
    select: (data) =>
      data
        .find((bill) => bill?.type === BillType.FACTURE)
        ?.billDetails?.filter((detail) => !!detail.productReference)
        .map((detail) => ({ id: detail.id, reference: detail.productReference!, quantity: detail.quantity })),
    enabled: item.state === AllBusinessState.FACTURE,
  });

  const { isLoading, data } = (() => {
    switch (item.state) {
      case AllBusinessState.DEVIS: {
        return {
          isLoading: isLoadingQuotation,
          data: quotationData,
        };
      }
      case AllBusinessState.ARC: {
        return {
          isLoading: isLoadingArc,
          data: arcData,
        };
      }
      case AllBusinessState.BP: {
        return {
          isLoading: isLoadingBp,
          data: bpData,
        };
      }
      case AllBusinessState.BL: {
        return {
          isLoading: isLoadingBl,
          data: blData,
        };
      }
      case AllBusinessState.FACTURE: {
        return {
          isLoading: isLoadingBill,
          data: billData,
        };
      }
      default:
        return { isLoading: false, data: undefined };
    }
  })();

  if (isLoading) return <ClipLoader color="white" />;
  if (!data) return "Les données liées à cette affaire n'ont pas pu être récupérées";

  return (
    <table>
      <thead>
        <tr>
          <th className="p-2 text-center align-middle">Image</th>
          <th className="p-2 text-center align-middle">Référence</th>
          <th className="p-2 text-center align-middle">Quantité</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-2 text-center align-middle">
              L&apos;affaire ne contient aucun produit
            </td>
          </tr>
        ) : (
          data.map((detail) => (
            <tr key={detail.id}>
              <td className="p-2 text-center align-middle">
                <img
                  src={`https://bd.vizeo.eu/6-Photos/${detail.reference}/${detail.reference}.png`}
                  alt={`Produit ${detail.reference}`}
                  width={32}
                  height={32}
                />
              </td>
              <td className="p-2 text-center align-middle">{detail.reference}</td>
              <td className="p-2 text-center align-middle">{detail.quantity}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
