import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getSaleVvaById, getSalesVvaByDepartmentCodesYearAndMonth, getSalesVvaPage } from '../../api/salesVva';

export const salesVva = createQueryKeys('sales-vva', {
  list: {
    queryKey: null,
    contextQueries: {
      byDepartmentCodesYearAndMonth: ({ departmentCodes, representativeId, year, month }: { departmentCodes?: Array<string> | null; representativeId?: string | null; year: number; month: number }) => ({
        queryKey: [{ departmentCodes, representativeId, year, month }],
        queryFn: () =>
          !!departmentCodes && departmentCodes.length > 0
            ? getSalesVvaByDepartmentCodesYearAndMonth({ repCodes: departmentCodes, representativeId, year, month })
            : Promise.resolve([]),
      }),
    },
  },
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getSalesVvaPage(page, size),
  }),
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getSaleVvaById(id),
  }),
});
