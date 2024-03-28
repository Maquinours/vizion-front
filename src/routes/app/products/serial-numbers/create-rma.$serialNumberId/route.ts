import { createFileRoute, redirect } from '@tanstack/react-router';
import { productSerialNumberQueryKeys } from '../../../../../utils/constants/queryKeys/productSerialNumber';
import { getProductSerialNumberById } from '../../../../../utils/api/productSerialNumber';

export const Route = createFileRoute('/app/products/serial-numbers/create-rma/$serialNumberId')({
  loader: async ({ context: { queryClient }, params: { serialNumberId } }) => {
    const serialNumber = await queryClient.ensureQueryData({
      queryKey: productSerialNumberQueryKeys.detailById(serialNumberId),
      queryFn: () => getProductSerialNumberById(serialNumberId),
    });
    if (!serialNumber.businessNumber || !serialNumber.businessNumber.startsWith('VZO ')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
});
