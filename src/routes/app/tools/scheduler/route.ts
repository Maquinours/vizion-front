import { createFileRoute } from '@tanstack/react-router';
import { Views } from 'react-big-calendar';
import { z } from 'zod';

const searchSchema = z.object({
  view: z.enum([Views.DAY, Views.WORK_WEEK, Views.MONTH, Views.WORK_WEEK, Views.AGENDA]).catch(Views.DAY),
  date: z.coerce.date().catch(new Date()),
});

export const Route = createFileRoute('/app/tools/scheduler')({
  validateSearch: searchSchema,
  staticData: {
    title: 'Agenda',
  },
});
