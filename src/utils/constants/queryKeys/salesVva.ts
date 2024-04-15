import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getSaleVvaById, getSalesVvaPage } from '../../api/salesVva';

export const salesVva = createQueryKeys('sales-vva', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getSalesVvaPage(page, size),
  }),
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getSaleVvaById(id),
  }),
});
