import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import YEARS from '../../../../utils/constants/years';
import { getAvailableMonthsForYear } from '../../../../utils/functions/moment';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  representativeId: z.string().optional().catch(undefined),
  year: z
    .number()
    .refine((value) => YEARS.includes(value))
    .catch(YEARS.at(-1)!),
  month: z
    .number()
    .min(1)
    .catch(new Date().getMonth() + 1),
});

export const Route = createFileRoute('/app/tools/representatives-turnover')({
  validateSearch: (search: Record<string, unknown>) => {
    const values = searchSchema.parse(search);
    if (!getAvailableMonthsForYear(values.year).at(values.month - 1)) values.month = getAvailableMonthsForYear(values.year).length;
    return values;
  },
  loaderDeps: ({ search: { representativeId, year, month } }) => ({ representativeId, year, month }),
  loader: async ({ context: { queryClient }, deps: { representativeId, year, month } }) => {
    const representatives = await queryClient.ensureQueryData(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));
    if (representativeId) {
      const representative = representatives.find((rep) => rep.id === representativeId);
      if (!representative)
        throw redirect({
          from: Route.id,
          search: (prev) => ({ ...prev, representativeId: undefined }),
        });

      queryClient.prefetchQuery(
        queries['sales-vva'].list._ctx.byDepartmentCodesYearAndMonth({
          departmentCodes: representative.departments?.map((dep) => dep.code) ?? [],
          year,
          month,
        }),
      );
    }
  },
  staticData: {
    title: 'CA des représentants',
  },
});
