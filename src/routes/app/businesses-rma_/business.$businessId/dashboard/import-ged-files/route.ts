import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  relativePath: z.string(),
});

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/import-ged-files')({
  validateSearch: searchSchema,
  pendingComponent: LoaderModal,
});
