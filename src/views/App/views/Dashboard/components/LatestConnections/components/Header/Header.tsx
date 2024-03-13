import { BsFillCircleFill } from 'react-icons/bs';
import styles from './Header.module.scss';
import { KEYCLOACK_STATES } from '../../utils/constants/states';

export default function AppViewDashboardViewLatestConnectionsComponentHeaderComponent() {
  return (
    <div className={styles.header_container}>
      {KEYCLOACK_STATES.map((item) => (
        <div key={item.value} className={styles.tag_tooltip}>
          <BsFillCircleFill color={item.color} height={20} width={20} />
          <div className={styles.tag_content}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
