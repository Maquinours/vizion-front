import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import LoaderModal from '../../../../components/LoaderModal/LoaderModal'

const searchSchema = z.object({
  gedObjectRelativePath: z
    .string()
    .transform((data) => decodeURIComponent(data))
    .catch(''),
})

export const Route = createFileRoute(
  '/app/enterprises_/$enterpriseId/import-ged-files',
)({
  validateSearch: searchSchema,
  pendingComponent: LoaderModal,
})
