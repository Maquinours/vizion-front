import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'
import { queries } from '../../../../../utils/constants/queryKeys'

export const Route = createFileRoute(
  '/app/enterprises_/$enterpriseId/task-email/$taskId/reply',
)({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const task = await queryClient.ensureQueryData(queries.tasks.detail(taskId))
    const email = await queryClient.ensureQueryData(
      queries.emails.detail(task.mailId!),
    )
    return { email }
  },
  pendingComponent: LoaderModal,
})
