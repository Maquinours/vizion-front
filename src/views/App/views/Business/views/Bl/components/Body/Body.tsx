import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Body.module.scss';
import { useMemo } from 'react';
import AppViewBusinessViewBlViewBodyComponentPdfComponent from './components/Pdf/Pdf';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bl');

export default function AppViewBusinessViewBlViewBodyComponent() {
  const { businessId } = routeApi.useParams();
  const { page } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: bls } = useSuspenseQuery(queries['business-bls'].list._ctx.byBusinessId(businessId));

  const bl = useMemo(() => bls.at(page), [bls, page]);

  if (!bl) return;
  return (
    <div className={styles.pdf_container}>
      <div className={styles.title}>Bon de Livraison {bl.number}</div>

      <div className={styles.pdf_viewer}>
        <PDFViewer showToolbar={!user.userInfo.roles.some((role) => ['ROLE_CLIENT', 'ROLE_REPRESENTANT_VIZEO'].includes(role)) && !business.archived}>
          <AppViewBusinessViewBlViewBodyComponentPdfComponent business={business} bl={bl} />
        </PDFViewer>
      </div>

      {!business.archived && (
        <div className={styles.buttons_container}>
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <Link from={routeApi.id} to="send-by-email" search={(old) => old} replace resetScroll={false} className="btn btn-secondary">
              Envoyer par mail
            </Link>
          )}
          {(user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) ||
            user.profile.categoryClient === 'DISTRIBUTEUR' ||
            user.profile.categoryClient === 'DISTRIBUTEUR_VVA') && (
            <PDFDownloadLink document={<AppViewBusinessViewBlViewBodyComponentPdfComponent business={business} bl={bl} />} fileName={bl.number + '.pdf'}>
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
          )}
        </div>
      )}
    </div>
  );
}
