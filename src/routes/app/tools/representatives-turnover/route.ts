import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import YEARS from '../../../../utils/constants/years';
import { getAvailableMonthsForYear } from '../../../../utils/functions/moment';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../utils/enums/CategoryClient';

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
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    const representatives = await queryClient.ensureQueryData(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));
    if (search.representativeId && !representatives.some((representative) => representative.id === search.representativeId))
      throw redirect({
        from: Route.id,
        search: { ...search, representativeId: undefined },
      });
  },
  staticData: {
    title: 'CA des représentants',
  },
});
