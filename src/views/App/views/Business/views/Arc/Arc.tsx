import { Outlet } from '@tanstack/react-router';
import AppViewBusinessViewArcViewHeaderComponent from './components/Header/Header';
import AppViewBusinessViewArcViewRecapComponent from './components/Recap/Recap';
import AppViewBusinessViewArcViewTableComponent from './components/Table/Table';

// const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

export default function AppViewBusinessViewArcView() {
  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: arc, dataUpdatedAt: arcDataUpdatedAt } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  // const { mutate, isPending } = useMutation({
  //   mutationFn: () => {
  //     const totalAmountHT = arc.arcDetailsList?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0;
  //     const vat = (totalAmountHT + arc.shippingServicePrice) * 0.2;
  //     const totalAmount = totalAmountHT + arc.shippingServicePrice + vat;

  //     return updateBusinessArc(arc.id, {
  //       number: arc.number,
  //       documentName: arc.documentName,
  //       shippingServicePrice: arc.shippingServicePrice,
  //       vat,
  //       numOrder: arc.numOrder,
  //       totalAmount,
  //       totalAmountHT,
  //       businessId: business.id,
  //       amountHtConfirmed: arc.amountHtConfirmed,
  //       shippingPriceConfirmed: arc.shippingPriceConfirmed,
  //     });
  //   },
  //   onMutate: () => {
  //     toast.loading("Une anomalie a été détectée sur l'ARC, correction en cours...", { autoClose: false, toastId: 'business-arc-correction' });
  //   },
  //   onSuccess: (arc) => {
  //     queryClient.setQueryData(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey, arc);
  //     toast.success("L'ARC a bien été corrigé");
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     toast.error("Une erreur est survenue lors de la correction de l'ARC. Veuillez réessayer ultérieurement.");
  //   },
  //   onSettled: () => {
  //     if (toast.isActive('business-arc-correction')) toast.dismiss('business-arc-correction');
  //   },
  // });

  // useEffect(() => {
  //   if (!!arc && !business.archived && !!arc.numOrder?.trim() && !isPending && Date.now() - arcDataUpdatedAt < 1000) {
  //     const totalAmountHT = Number((arc.arcDetailsList?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0).toFixed(2));
  //     const vat = Number(((totalAmountHT + arc.shippingServicePrice) * 0.2).toFixed(2));
  //     const totalAmount = Number((totalAmountHT + arc.shippingServicePrice + vat).toFixed(2));
  //     console.log({ totalAmountHT, arcTotalAmountHT: arc.totalAmountHT, vat, arcVat: arc.vat, totalAmount, arcTotalAmount: arc.totalAmount });
  //     if (totalAmountHT !== (arc.totalAmountHT ?? 0) || vat !== arc.vat || totalAmount !== (arc.totalAmount ?? 0)) mutate();
  //   }
  // }, [arc]);

  return (
    <>
      <AppViewBusinessViewArcViewHeaderComponent />
      <AppViewBusinessViewArcViewTableComponent />
      <AppViewBusinessViewArcViewRecapComponent />
      <Outlet />
      {/* <LoaderModal isLoading={isPending} /> */}
    </>
  );
}
