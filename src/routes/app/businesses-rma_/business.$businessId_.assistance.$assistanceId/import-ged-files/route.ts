import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  directoryRelativePath: z.string().optional(),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/import-ged-files')({
  validateSearch: searchSchema,
  pendingComponent: LoaderModal,
});
