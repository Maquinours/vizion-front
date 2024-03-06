import styles from './Body.module.scss';
import SendEmailComponentBodyComponentEmailContentComponent from './components/EmailContent/EmailContent';
import SendEmailComponentBodyComponentAttachmentsComponent from './components/Attachments/Attachments';

export default function SendEmailComponentBodyComponent() {
  return (
    <div className={styles.grid_two}>
      <SendEmailComponentBodyComponentEmailContentComponent />
      <SendEmailComponentBodyComponentAttachmentsComponent />
    </div>
  );
}
