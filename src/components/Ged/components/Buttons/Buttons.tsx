import { AiOutlineReload } from 'react-icons/ai';
import styles from './Buttons.module.scss';
import { useContext } from 'react';
import { GedContext } from '../../utils/contexts/ged';
import { Link } from '@tanstack/react-router';

type GedComponentButtonsComponentProps = Readonly<{
  onReload: () => void;
}>;
export default function GedComponentButtonsComponent({ onReload }: Readonly<GedComponentButtonsComponentProps>) {
  const { canMakeAction, getImportFilesLink, getCreateDirectoryLink } = useContext(GedContext)!;

  if (canMakeAction)
    return (
      <div className={styles.buttons_container}>
        <Link {...getImportFilesLink()} className="btn btn-primary">
          Importer un fichier
        </Link>
        <Link {...getCreateDirectoryLink()} className="btn btn-primary-light">
          Nouveau dossier
        </Link>
        <button className="btn btn-primary" onClick={onReload}>
          <AiOutlineReload width="16" height="16" color="#FFF" />
        </button>
      </div>
    );
}
