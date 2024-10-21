import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './ButtonsSection.module.scss';
import AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponentExportButton from './components/ExportButton/ExportButton';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponent() {
  const { hideTotal, hideReferences, hidePrices, hideAddresses } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.actions_container}>
      {!user.userInfo.roles.includes('ROLE_CLIENT') && (
        <>
          <Link
            from={routeApi.id}
            search={(prev) => ({ ...prev, hideTotal: !hideTotal })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
          >
            {hideTotal ? 'Afficher' : 'Masquer'} total
          </Link>
          <Link
            from={routeApi.id}
            search={(prev) => ({ ...prev, hideReferences: !hideReferences })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
          >
            {hideReferences ? 'Afficher' : 'Masquer'} les références
          </Link>
          <Link
            from={routeApi.id}
            search={(prev) => ({ ...prev, hidePrices: !hidePrices })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
          >
            {hidePrices ? 'Afficher' : 'Masquer'} les prix
          </Link>
          <Link
            from={routeApi.id}
            search={(prev) => ({ ...prev, hideAddresses: !hideAddresses })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
          >
            {hideAddresses ? 'Afficher' : 'Masquer'} {"l'adresse"}
          </Link>
        </>
      )}
      <Link from={routeApi.id} to="pdf" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-primary">
        Éditer
      </Link>
      {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && (
        <AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponentExportButton />
      )}
    </div>
  );
}
