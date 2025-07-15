import BusinessQuotationResponseDto from '../../../../../../../../utils/types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import styles from './SectionThree.module.scss';
import BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentAddLineSectionComponent from './components/AddLineSection/AddLineSection';
import BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';
// import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

type BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentProps = Readonly<{
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
export default function BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponent({
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
}: BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentProps) {
  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles._two}>
      {business.archived ? (
        <div></div>
      ) : (
        <BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentAddLineSectionComponent business={business} quotation={quotation} />
      )}
      <BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponentButtonsSectionComponent
        business={business}
        quotation={quotation}
        hideTotal={hideTotal}
        setHideTotal={setHideTotal}
        hideReferences={hideReferences}
        setHideReferences={setHideReferences}
        hidePrices={hidePrices}
        setHidePrices={setHidePrices}
        hideAddresses={hideAddresses}
        setHideAddresses={setHideAddresses}
        onEditClick={onEditClick}
      />
    </div>
  );
}
