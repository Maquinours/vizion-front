import BusinessQuotationResponseDto from '../../../../../../utils/types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import BusinessModalComponentQuotationComponentHeaderComponentSectionOneComponent from './components/SectionOne/SectionOne';
import BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponent from './components/SectionThree/SectionThree';
import BusinessModalComponentQuotationComponentHeaderComponentSectionTwoComponent from './components/SectionTwo/SectionTwo';

type BusinessModalComponentQuotationComponentHeaderComponentProps = Readonly<{
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
  goToNextStep: () => void;
}>;
export default function BusinessModalComponentQuotationComponentHeaderComponent({
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
  goToNextStep,
}: BusinessModalComponentQuotationComponentHeaderComponentProps) {
  return (
    <>
      <BusinessModalComponentQuotationComponentHeaderComponentSectionOneComponent business={business} quotation={quotation} goToNextStep={goToNextStep} />
      <BusinessModalComponentQuotationComponentHeaderComponentSectionTwoComponent business={business} quotation={quotation} />
      <BusinessModalComponentQuotationComponentHeaderComponentSectionThreeComponent
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
    </>
  );
}
