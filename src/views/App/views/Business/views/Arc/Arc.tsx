import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queryClient } from '../../../../../../router';
import { updateBusinessArc } from '../../../../../../utils/api/businessArcs';
import { queries } from '../../../../../../utils/constants/queryKeys';
import AppViewBusinessViewArcViewHeaderComponent from './components/Header/Header';
import AppViewBusinessViewArcViewRecapComponent from './components/Recap/Recap';
import AppViewBusinessViewArcViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

export default function AppViewBusinessViewArcView() {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const { isPending } = useMutation({
    mutationFn: () => {
      const totalAmountHT = arc.arcDetailsList?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0;
      const vat = (totalAmountHT + arc.shippingServicePrice) * 0.2;
      const totalAmount = totalAmountHT + arc.shippingServicePrice + vat;

      return updateBusinessArc(arc.id, {
        number: arc.number,
        documentName: arc.documentName,
        shippingServicePrice: arc.shippingServicePrice,
        vat,
        numOrder: arc.numOrder,
        totalAmount,
        totalAmountHT,
        businessId: business.id,
        amountHtConfirmed: arc.amountHtConfirmed,
        shippingPriceConfirmed: arc.shippingPriceConfirmed,
      });
    },
    onMutate: () => {
      toast.loading("Une anomalie a été détectée sur l'ARC, correction en cours...", { autoClose: false, toastId: 'business-arc-correction' });
    },
    onSuccess: (arc) => {
      queryClient.setQueryData(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey, arc);
      toast.success("L'ARC a bien été corrigé");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la correction de l'ARC. Veuillez réessayer ultérieurement.");
    },
    onSettled: () => {
      if (toast.isActive('business-arc-correction')) toast.dismiss('business-arc-correction');
    },
  });

  useEffect(() => {
    if (!!arc && !business.archived && !!arc.numOrder?.trim()) {
      const totalAmountHT = arc.arcDetailsList?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0;
      const vat = (totalAmountHT + arc.shippingServicePrice) * 0.2;
      const totalAmount = totalAmountHT + arc.shippingServicePrice + vat;
      console.log({ totalAmountHT, arcTotalAmountHT: arc.totalAmountHT, vat, arcVat: arc.vat, totalAmount, arcTotalAmount: arc.totalAmount });
      // if (totalAmountHT !== (arc.totalAmountHT ?? 0) || vat !== arc.vat || totalAmount !== (arc.totalAmount ?? 0)) mutate();
    }
  }, [arc, business.archived]);

  return (
    <>
      <AppViewBusinessViewArcViewHeaderComponent />
      <AppViewBusinessViewArcViewTableComponent />
      <AppViewBusinessViewArcViewRecapComponent />
      <Outlet />
      <LoaderModal isLoading={isPending} />
    </>
  );
}
