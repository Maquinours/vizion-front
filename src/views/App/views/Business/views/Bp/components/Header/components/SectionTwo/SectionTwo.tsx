import AppViewBusinessViewBpViewHeaderComponentSectionTwoComponentAddDetailSectionComponent from './components/AddDetailSection/AddDetailSection';
import AppViewBusinessViewBpViewHeaderComponentSectionTwoComponentAddSerialNumberSectionComponent from './components/AddSerialNumberSection/AddSerialNumberSection';
import styles from './SectionTwo.module.scss';

export default function AppViewBusinessViewBpViewHeaderComponentSectionTwoComponent() {
  return (
    <div className={styles.container}>
      <AppViewBusinessViewBpViewHeaderComponentSectionTwoComponentAddDetailSectionComponent />
      <AppViewBusinessViewBpViewHeaderComponentSectionTwoComponentAddSerialNumberSectionComponent />
    </div>
  );
}
