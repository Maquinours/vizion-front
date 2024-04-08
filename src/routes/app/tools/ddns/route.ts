import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ddns } from '../../../../utils/constants/queryKeys/ddns';

const searchSchema = z.object({
  email: z.string().optional().catch(undefined),
  domain: z.string().optional().catch(undefined),
  serial: z.string().optional().catch(undefined),
  ref: z.string().optional().catch(undefined),
  date: z.coerce.date().optional().catch(undefined),
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/ddns')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { email, domain, serial, ref, date, page } }) => ({ email, domain, serial, ref, date, page, size: 15 }),
  loader: ({ context: { queryClient }, deps: { email, domain, serial, ref, date, page, size } }) => {
    queryClient.prefetchQuery(ddns.page({ email, domain, serial, ref, date, page, size }));
  },
});
