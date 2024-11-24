import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  relativePath: z.string().optional(),
});

export const Route = createFileRoute('/app/businesses-rma_/rma/$rmaId/support/create-ged-directory')({
  validateSearch: searchSchema,
  pendingComponent: LoaderModal,
});
