import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewBpViewPrintLabelModalView from '../../../../../../views/App/views/Business/views/Bp/views/PrintLabelModal/PrintLabelModal'

export const Route = createLazyFileRoute(
    '/app/businesses-rma_/business/$businessId/bp/print-label/$detailId',
)({
    component: AppViewBusinessViewBpViewPrintLabelModalView
});
