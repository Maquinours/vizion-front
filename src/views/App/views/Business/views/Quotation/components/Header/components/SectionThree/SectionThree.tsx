import styles from './SectionThree.module.scss';
import AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentAddLineSectionComponent from './components/AddLineSection/AddLineSection';
import AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponent() {
  return (
    <div className={styles._two}>
      <AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentAddLineSectionComponent />
      <AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponent />
    </div>
  );
}
