import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/enterprises_/$enterpriseId/email-history/email/$emailId',
)({
  loader: async ({ context: { queryClient }, params: { emailId } }) => {
    await queryClient.ensureQueryData(queries.emails.detail(emailId))
  },
  pendingComponent: LoaderModal,
})
