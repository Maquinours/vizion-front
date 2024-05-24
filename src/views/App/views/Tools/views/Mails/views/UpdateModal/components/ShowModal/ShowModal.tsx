import ReactModal from 'react-modal';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './ShowModal.module.scss';
import { PDFViewer } from '@react-pdf/renderer';
import AppViewToolsViewMailsViewUpdateModalViewPdfModalComponentPdfComponent from './components/Pdf/Pdf';
import { UpdateMailFormType } from '../FormModal/FormModal';
import MailPaperResponseDto from '../../../../../../../../../../utils/types/MailPaperResponseDto';

type AppViewToolsViewMailsViewUpdateModalViewShowModalComponentProps = Readonly<{
  show: boolean;
  mail: MailPaperResponseDto;
  data: UpdateMailFormType | undefined;
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
}>;
export default function AppViewToolsViewMailsViewUpdateModalViewShowModalComponent({
  show,
  mail,
  data,
  onClose,
  onSubmit,
  isPending,
}: AppViewToolsViewMailsViewUpdateModalViewShowModalComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <ReactModal isOpen={show} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      {show && !!data && (
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre courrier :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer showToolbar={false}>
              <AppViewToolsViewMailsViewUpdateModalViewPdfModalComponentPdfComponent mail={mail} data={data} user={user} />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={() => onClose()}>
              Modifier
            </button>
            <button className="btn btn-secondary" onClick={() => onSubmit()}>
              {isPending ? 'Sauvegarde en cours...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      )}
    </ReactModal>
  );
}
