import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewAssistanceViewImportGedFilesModalView from '../../../../../../views/App/views/Assistance/views/ImportGedFilesModal/ImportGedFilesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/import-ged-files',
)({
  component: AppViewAssistanceViewImportGedFilesModalView,
})
