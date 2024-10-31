import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../../utils/constants/queryKeys'
import { pdf } from '@react-pdf/renderer'
import AppViewBusinessViewArcViewPdfModalViewPdfComponent from '../../../../../../../views/App/views/Business/views/Arc/views/PdfModal/components/Pdf/Pdf'
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal'
import { formatFileName } from '../../../../../../../utils/functions/files'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/arc/pdf/send-by-email',
)({
  loaderDeps: ({ search: { hideReferencesPrices } }) => ({
    hideReferencesPrices,
  }),
  loader: async ({
    context: { queryClient },
    params: { businessId },
    deps: { hideReferencesPrices },
  }) => {
    const businessPromise = queryClient.ensureQueryData(
      queries.businesses.detail._ctx.byId(businessId),
    )
    const arcPromise = queryClient.ensureQueryData(
      queries['business-ARCs'].detail._ctx.byBusinessId(businessId),
    )

    const business = await businessPromise
    const department = await (business.deliveryDepartmentCode
      ? queryClient.ensureQueryData(
          queries.departments.detail._ctx.byCode(
            business.deliveryDepartmentCode,
          ),
        )
      : Promise.resolve(undefined))
    const representative = await (department?.repEnterprise
      ? queryClient.ensureQueryData(
          queries.enterprise.detail(department.repEnterprise!.id),
        )
      : Promise.resolve(undefined))
    const arc = await arcPromise
    const blob = await pdf(
      <AppViewBusinessViewArcViewPdfModalViewPdfComponent
        business={business}
        arc={arc}
        hideReferencesPrices={hideReferencesPrices}
      />,
    ).toBlob()
    const file = new File([blob], formatFileName(`ARC-${arc.number}.pdf`), {
      type: blob.type,
    })

    return {
      business,
      arc,
      representative,
      file,
    }
  },
  pendingComponent: LoaderModal,
})
