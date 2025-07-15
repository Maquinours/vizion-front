import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import BusinessModalComponentBpComponentHeaderComponentSectionOneComponent from './components/SectionOne/SectionOne';
import BusinessModalComponentBpComponentHeaderComponentSectionTwoComponent from './components/SectionTwo/SectionTwo';

type BusinessModalComponentBpComponentHeaderComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
}>;
export default function BusinessModalComponentBpComponentHeaderComponent({ business, bp }: BusinessModalComponentBpComponentHeaderComponentProps) {
  return (
    <>
      <BusinessModalComponentBpComponentHeaderComponentSectionOneComponent business={business} />
      <BusinessModalComponentBpComponentHeaderComponentSectionTwoComponent business={business} bp={bp} />
    </>
  );
}
