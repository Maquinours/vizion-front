import styles from './RepresentativesMap.module.scss';
import AppViewToolsViewRepresentativesMapViewTableComponent from './components/Table/Table';

export default function AppViewToolsViewRepresentativesMapView() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <AppViewToolsViewRepresentativesMapViewTableComponent />
        <div className={styles.card_item}>
          <img src="https://bd.vizeo.eu/9-Vizeo/carte_des_representants_sans_fond.png" alt="Carte des représentants VIZEO" />
        </div>
      </div>
    </div>
  );
}
