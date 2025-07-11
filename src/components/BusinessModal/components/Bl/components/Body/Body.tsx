import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useMemo } from 'react';
import BusinessBlResponseDto from '../../../../../../utils/types/BusinessBlResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import styles from './Body.module.scss';
import AppViewBusinessViewBlViewBodyComponentPdfComponent from './components/Pdf/Pdf';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bl');
// const routePath = '/app/businesses-rma/business/$businessId/bl';

type BusinessModalComponentBlComponentBodyComponentProps = Readonly<{
  business: BusinessResponseDto;
  bls: Array<BusinessBlResponseDto>;
  page: number;
  onSendByEmailClick: () => void;
}>;
export default function BusinessModalComponentBlComponentBodyComponent({
  business,
  bls,
  page,
  onSendByEmailClick,
}: BusinessModalComponentBlComponentBodyComponentProps) {
  // const { businessId } = routeApi.useParams();
  // const { page } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: bls } = useSuspenseQuery(queries['business-bls'].list._ctx.byBusinessId(businessId));

  const bl = useMemo(() => bls.at(page), [bls, page]);

  if (!bl) return;
  return (
    <div className={styles.pdf_container}>
      <div className={styles.title}>Bon de Livraison {bl.number}</div>

      <div className={styles.pdf_viewer}>
        <PDFViewer
          key={Date.now()}
          showToolbar={!user.userInfo.roles.some((role) => ['ROLE_CLIENT', 'ROLE_REPRESENTANT_VIZEO'].includes(role)) && !business.archived}
        >
          <AppViewBusinessViewBlViewBodyComponentPdfComponent business={business} bl={bl} />
        </PDFViewer>
      </div>

      {!business.archived && (
        <div className={styles.buttons_container}>
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <button className="btn btn-secondary" onClick={onSendByEmailClick}>
              Envoyer par mail
            </button>
          )}
          {/* {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
              Envoyer par mail
            </Link>
          )} */}
          {(user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) ||
            user.profile.categoryClient === 'DISTRIBUTEUR' ||
            user.profile.categoryClient === 'DISTRIBUTEUR_VVA') && (
            <PDFDownloadLink
              key={Date.now()}
              document={<AppViewBusinessViewBlViewBodyComponentPdfComponent business={business} bl={bl} />}
              fileName={bl.number + '.pdf'}
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
          )}
          {/* {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <Link from={routePath} to="update" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
              Modifier
            </Link>
          )} */}
        </div>
      )}
    </div>
  );
}
