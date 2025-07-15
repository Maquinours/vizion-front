import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessQuotationDetailsResponseDto from '../../../../../../../../utils/types/BusinessQuotationDetailsResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../views/App/utils/functions/getAuthentifiedUser';
import AmountFormat from '../../../../../../../AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../CurrencyFormat/CurrencyFormat';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

type BusinessModalComponentQuotationComponentTableComponentQuotationDetailRowComponentProps = Readonly<{
  detail: BusinessQuotationDetailsResponseDto;
  onContextMenu: (e: React.MouseEvent, detail: BusinessQuotationDetailsResponseDto) => void;
  hideReferences: boolean;
  hidePrices: boolean;
}>;
export default function BusinessModalComponentQuotationComponentTableComponentQuotationDetailRowComponent({
  detail,
  onContextMenu,
  hideReferences,
  hidePrices,
}: BusinessModalComponentQuotationComponentTableComponentQuotationDetailRowComponentProps) {
  // const { hideReferences, hidePrices } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: productStock } = useSuspenseQuery({
    ...queries['product-stocks'].list._ctx.all,
    select: (data) => data.find((stock) => stock.productId === detail.productId),
  });

  return (
    <tr key={detail.id} onContextMenu={(e) => onContextMenu(e, detail)}>
      <td>
        <div className="flex h-full w-full items-center justify-center">
          <img src={`https://bd.vizeo.eu/6-Photos/${detail.productReference}/MINI_${detail.productReference}.jpg`} alt={detail.productReference} />
        </div>
      </td>
      <td>{!hideReferences && <p style={{ fontWeight: '900' }}>{detail.productReference}</p>}</td>
      <td>
        <p>{detail.productDesignation}</p>
      </td>
      <td>
        <p style={{ fontWeight: '900' }}>{detail.quantity}</p>
      </td>
      <td>
        {!productStock?.virtualQty && !productStock?.bom && (
          <AmountFormat value={productStock?.currentStock ?? 0} decimalScale={0} style={{ fontStyle: 'italic' }} />
        )}
      </td>
      <td>
        {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && !hidePrices && (
          <CurrencyFormat value={detail.publicUnitPrice} />
        )}
      </td>
      <td>
        {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
          <AmountFormat value={detail.reduction} decimalScale={0} suffix="%" />
        )}
      </td>
      <td>{!hidePrices && <CurrencyFormat value={detail.unitPrice} />}</td>
      <td>
        <CurrencyFormat style={{ fontWeight: '900' }} value={detail.totalPrice} />
      </td>
    </tr>
  );
}
