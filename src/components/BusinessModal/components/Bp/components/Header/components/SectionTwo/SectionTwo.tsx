import BusinessBpResponseDto from '../../../../../../../../utils/types/BusinessBpResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddDetailSectionComponent from './components/AddDetailSection/AddDetailSection';
import BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddSerialNumberSectionComponent from './components/AddSerialNumberSection/AddSerialNumberSection';
import styles from './SectionTwo.module.scss';

type BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
}>;
export default function BusinessModalComponentBpComponentHeaderComponentSectionTwoComponent({
  business,
  bp,
}: BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentProps) {
  return (
    <div className={styles.container}>
      <BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddDetailSectionComponent business={business} bp={bp} />
      <BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddSerialNumberSectionComponent business={business} bp={bp} />
    </div>
  );
}
