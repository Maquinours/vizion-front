import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { mailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/mails';
import styles from './ShowModal.module.scss';
import AppViewToolsViewMailsViewShowModalViewPdfComponent from './components/Pdf/Pdf';

const routeApi = getRouteApi('/app/tools/mails/show/$mailId');

export default function AppViewToolsViewMailsViewShowModalView() {
  const navigate = routeApi.useNavigate();

  const { mailId } = routeApi.useParams();

  const { data: mail } = useSuspenseQuery(mailQueryKeys.detail._ctx.byId(mailId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Votre courrier :</h6>
        </div>
        <div className={styles.modal_pdfviewer}>
          <PDFViewer>
            <AppViewToolsViewMailsViewShowModalViewPdfComponent mail={mail} />
          </PDFViewer>
        </div>
        <div className={styles.modal_footer}>
          <button className="btn btn-primary" onClick={() => onClose()}>
            Modifier
          </button>

          <PDFDownloadLink
            document={<AppViewToolsViewMailsViewShowModalViewPdfComponent mail={mail} />}
            fileName={`${mail.enterpriseName}-${mail.reference}.pdf`}
          >
            {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
          </PDFDownloadLink>
        </div>
      </div>
    </ReactModal>
  );
}
