import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Bill.module.scss';
import { useEffect, useMemo } from 'react';
import BillType from '../../../../../../utils/enums/BillType';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import AppViewBusinessViewBillViewPdfComponent from './components/Pdf/Pdf';
import { reloadBusinessBill } from '../../../../../../utils/api/businessBill';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bill');
const routePath = '/app/businesses-rma/business/$businessId/bill';

export default function AppViewBusinessViewBillView() {
  const queryClient = useQueryClient();
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: bills } = useSuspenseQuery(queries['business-bills'].list._ctx.byBusinessId(businessId));

  const credits = useMemo(() => bills.filter((bill) => bill.type === BillType.AVOIR), [bills]);
  const bill = useMemo(() => bills.find((bill) => bill.type === BillType.FACTURE), [bills]);

  const { mutate: refreshBill, isPending: isRefreshingBill } = useMutation({
    mutationFn: () =>
      reloadBusinessBill({
        numBusiness: business.numBusiness,
        numOrder: business.numOrder,
        businessId: business.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-bills']._def });
      toast.success('La facture a été rafraîchie avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors du rafraîchissement de la facture');
    },
  });

  useEffect(() => {
    if (!!bill) {
      const totalAmountHT = bill.billDetails.reduce((acc, item) => acc + item.quantity * (item.unitPrice ?? 0), 0);
      const vat = business.exportTva ? (totalAmountHT + bill.shippingServicePrice) * 0.2 : 0;
      const totalAmount = totalAmountHT + bill.shippingServicePrice + vat;
      console.log({ totalAmountHT, vat, totalAmount });
      if (totalAmount !== bill.totalAmount)
        toast.warning(
          `Le montant total de la facture ne semble pas conforme. Montant total calculé : ${totalAmount.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}€`,
          { autoClose: false },
        );
      else if (!business.exportTva)
        toast.warning("Cette facture est catégorisée comme export et n'a donc pas de TVA. Êtes vous sûr de vouloir continuer ?", { autoClose: false });
    }
  }, [bill]);

  return (
    <>
      <div className={styles.container}>
        {!business.archived && credits.length > 0 && user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
          <div className={styles.avoir_container}>
            <Link from={routePath} to="credits" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
              Voir les avoirs
            </Link>
          </div>
        )}
        {!!bill && (
          <div className={styles.pdf_container}>
            <div className={styles.title}>Facture : {bill.number}</div>

            <div className={styles.pdf_viewer}>
              <PDFViewer showToolbar={!user.userInfo.roles.some((role) => ['ROLE_CLIENT', 'ROLE_REPRESENTANT_VIZEO'].includes(role)) && !business.archived}>
                <AppViewBusinessViewBillViewPdfComponent bill={bill} business={business} />
              </PDFViewer>
            </div>
            {!business.archived && (
              <div className={styles.buttons_container}>
                {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                  <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
                    Envoyer par mail
                  </Link>
                )}
                {(user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) ||
                  user.profile.categoryClient === 'DISTRIBUTEUR' ||
                  user.profile.categoryClient === 'DISTRIBUTEUR_VVA') && (
                  <PDFDownloadLink document={<AppViewBusinessViewBillViewPdfComponent bill={bill} business={business} />} fileName={`${bill.number}.pdf`}>
                    {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
                  </PDFDownloadLink>
                )}

                {bill && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                  <button className="btn btn-primary" onClick={() => refreshBill()}>
                    {isRefreshingBill ? 'Rafraîchissement en cours...' : 'Rafraîchir'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
}
