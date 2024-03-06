import { AiOutlineReload } from 'react-icons/ai';
import styles from './Buttons.module.scss';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';

type GedComponentButtonsComponentProps = Readonly<{
  canMakeAction?: boolean;
  openImportFilesModal: (item?: FileDataTreeResponseDto) => void;
  openCreateDirectoryModal: (item?: FileDataTreeResponseDto) => void;
  onReload: () => void;
}>;
export default function GedComponentButtonsComponent({
  canMakeAction = false,
  openImportFilesModal,
  openCreateDirectoryModal,
  onReload,
}: Readonly<GedComponentButtonsComponentProps>) {
  if (canMakeAction)
    return (
      <div className={styles.buttons_container}>
        <button className="btn btn-primary" onClick={() => openImportFilesModal()}>
          Importer un fichier
        </button>
        <button className="btn btn-primary-light" onClick={() => openCreateDirectoryModal()}>
          Nouveau dossier
        </button>
        <button className="btn btn-primary" onClick={onReload}>
          <AiOutlineReload width="16" height="16" color="#FFF" />
        </button>
      </div>
    );
}
