import styles from './GlobalTurnover.module.scss';
import AppViewToolsViewGlobalTurnoverViewInputsSectionComponent from './components/InputsSection/InputsSection';
import AppViewToolsViewGlobalTurnoverViewTableComponent from './components/Table/Table';

export default function AppViewToolsViewGlobalTurnoverView() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <AppViewToolsViewGlobalTurnoverViewInputsSectionComponent />
        <AppViewToolsViewGlobalTurnoverViewTableComponent />
      </div>
    </div>
  );
}
