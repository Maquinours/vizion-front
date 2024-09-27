import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../utils/types/Page';
import ProductSerialNumberResponseDto from '../../../../../utils/types/ProductSerialNumberResponseDto';

export const Route = createFileRoute('/app/products/serial-numbers/remove-from-business/$serialNumberId')({
  loader: async ({ context: { queryClient }, params: { serialNumberId } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO')) throw notFound();

    let initialDataKey: QueryKey | undefined = undefined;
    const serialNumber = await queryClient.ensureQueryData({
      ...queries['product-serial-numbers'].detail._ctx.byId(serialNumberId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<ProductSerialNumberResponseDto>>({
          queryKey: queries['product-serial-numbers'].page._def,
        })) {
          const item = value?.content.find((item) => item.id === serialNumberId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });

    if (!serialNumber.businessId) throw redirect({ from: Route.id, to: '../..', search: true, replace: true });

    const [business, bp] = await Promise.all([
      queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(serialNumber.businessId)),
      queryClient.ensureQueryData(queries['business-bps'].detail._ctx.byBusinessId(serialNumber.businessId!)),
    ]);

    const bpDetail = bp.bpDetailsList.find((detail) => detail.bpSerialList?.some((serial) => serial.numSerie === serialNumber.serialNumber));
    const bpSerialNumber = bpDetail?.bpSerialList?.find((serial) => serial?.numSerie === serialNumber.serialNumber);

    if (!bpDetail || !bpSerialNumber) {
      toast.error('Une erreur est survenue lors de la récupération des données liées au numéro de série');
      throw redirect({ from: Route.id, to: '../..', search: true, replace: true });
    }

    return { serialNumber, business, bp, bpDetail, bpSerialNumber };
  },
  pendingComponent: LoaderModal,
});
