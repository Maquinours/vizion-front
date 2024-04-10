import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getTurnoversByYear } from '../../api/turnovers';

export const turnovers = createQueryKeys('turnovers', {
  detail: (year: number) => ({
    queryKey: [year],
    queryFn: () => getTurnoversByYear(year),
  }),
});
