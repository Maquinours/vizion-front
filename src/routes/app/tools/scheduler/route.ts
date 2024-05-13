import { createFileRoute } from '@tanstack/react-router';
import { Views } from 'react-big-calendar';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  view: z.enum([Views.DAY, Views.WORK_WEEK, Views.MONTH, Views.WORK_WEEK, Views.AGENDA]).catch(Views.DAY),
  date: z.coerce.date().catch(new Date()),
});

export const Route = createFileRoute('/app/tools/scheduler')({
  validateSearch: searchSchema,
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries['rdv-user-infos'].list);
  },
  staticData: {
    title: 'Agenda',
  },
});
