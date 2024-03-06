import styles from './Header.module.scss';
import SendEmailComponentHeaderComponentInputsComponent from './components/Inputs/Inputs';
import SendEmailComponentHeaderComponentButtonsComponent from './components/Buttons/Buttons';

export default function SendEmailComponentHeaderComponent() {
  return (
    <div className={styles.grid_one}>
      <SendEmailComponentHeaderComponentInputsComponent />
      <SendEmailComponentHeaderComponentButtonsComponent />
    </div>
  );
}
