import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../utils/enums/BusinessState';
import { redirect } from '@tanstack/react-router';

const searchSchema = z.object({
  hideTotal: z.boolean().catch(false),
  hideReferences: z.boolean().catch(false),
  hidePrices: z.boolean().catch(false),
  hideAddresses: z.boolean().catch(true),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/quotation')({
  validateSearch: (data: { hideTotal?: boolean; hideReferences?: boolean; hidePrices?: boolean; hideAddresses?: boolean } & SearchSchemaInput) =>
    searchSchema.parse(data),
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    const businessState = business.oldState ?? business.state;
    if (!businessState || ![BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE].includes(businessState))
      throw redirect({ from: Route.id, to: '..', search: true, replace: true, resetScroll: false });
    await queryClient.ensureQueryData(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  },
});
