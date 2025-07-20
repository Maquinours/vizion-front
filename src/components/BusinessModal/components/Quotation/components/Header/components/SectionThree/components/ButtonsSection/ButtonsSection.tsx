import BusinessQuotationResponseDto from '../../../../../../../../../../utils/types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../../../views/App/utils/functions/getAuthentifiedUser';
import styles from './ButtonsSection.module.scss';
import BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponentExportButton from './components/ExportButton/ExportButton';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');
// const routePath = '/app/businesses-rma/business/$businessId/quotation';

type BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponentProps = Readonly<{
  business: BusinessResponseDto;
  quotation: BusinessQuotationResponseDto;
  hideTotal: boolean;
  setHideTotal: React.Dispatch<React.SetStateAction<boolean>>;
  hideReferences: boolean;
  setHideReferences: React.Dispatch<React.SetStateAction<boolean>>;
  hidePrices: boolean;
  setHidePrices: React.Dispatch<React.SetStateAction<boolean>>;
  hideAddresses: boolean;
  setHideAddresses: React.Dispatch<React.SetStateAction<boolean>>;
  onEditClick: () => void;
}>;
export default function BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponent({
  business,
  quotation,
  hideTotal,
  setHideTotal,
  hideReferences,
  setHideReferences,
  hidePrices,
  setHidePrices,
  hideAddresses,
  setHideAddresses,
  onEditClick,
}: BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponentProps) {
  // const { hideTotal, hideReferences, hidePrices, hideAddresses } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.actions_container}>
      {!user.userInfo.roles.includes('ROLE_CLIENT') && (
        <>
          <button type="button" className="btn btn-primary-light" onClick={() => setHideTotal((hideTotal) => !hideTotal)}>
            {hideTotal ? 'Afficher' : 'Masquer'} total
          </button>
          <button type="button" className="btn btn-primary-light" onClick={() => setHideReferences((hideReferences) => !hideReferences)}>
            {hideReferences ? 'Afficher' : 'Masquer'} les références
          </button>
          <button type="button" className="btn btn-primary-light" onClick={() => setHidePrices((hidePrices) => !hidePrices)}>
            {hidePrices ? 'Afficher' : 'Masquer'} les prix
          </button>
          <button type="button" className="btn btn-primary-light" onClick={() => setHideAddresses((hideAddresses) => !hideAddresses)}>
            {hideAddresses ? 'Afficher' : 'Masquer'} l&apos;adresse
          </button>
          {/* <Link
            from={routePath}
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
            from={routePath}
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
            from={routePath}
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
            from={routePath}
            search={(prev) => ({ ...prev, hideAddresses: !hideAddresses })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
            preload="intent"
            ignoreBlocker
          >
            {hideAddresses ? 'Afficher' : 'Masquer'} {"l'adresse"}
          </Link> */}
        </>
      )}
      <button type="button" className="btn btn-primary" onClick={onEditClick}>
        Éditer
      </button>
      {/* <Link from={routePath} to="pdf" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-primary">
        Éditer
      </Link> */}
      {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && (
        <BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponentExportButton
          business={business}
          quotation={quotation}
        />
      )}
    </div>
  );
}
