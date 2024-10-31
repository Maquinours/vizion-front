import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'

const searchSchema = z.object({
  searchText: z.string().optional(),
  page: z.number().min(0).catch(0),
})

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/address-book',
)({
  validateSearch: (
    data: { searchText?: string; page?: number } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  pendingComponent: LoaderModal,
})
