import styles from './Buttons.module.scss';
import { useContext, useMemo } from 'react';
import { GedContext } from '../../utils/contexts/ged';
import { Link } from '@tanstack/react-router';
import RefreshButtonComponent from '../../../RefreshButton/RefreshButton';

type GedComponentButtonsComponentProps = Readonly<{
  refetch: () => void;
  isRefetching: boolean;
}>;
export default function GedComponentButtonsComponent({ refetch, isRefetching }: Readonly<GedComponentButtonsComponentProps>) {
  const { canMakeAction, getImportFilesLink, onImportFilesClick, getCreateDirectoryLink, onCreateDirectoryClick } = useContext(GedContext)!;

  const importFilesButton = useMemo(() => {
    if (getImportFilesLink && onImportFilesClick) throw new Error('getImportFilesLink and onImportFilesClick cannot be both defined');

    const text = 'Importer un fichier';

    if (getImportFilesLink)
      return (
        <Link {...getImportFilesLink()} preload="intent" className="btn btn-primary">
          {text}
        </Link>
      );
    else if (onImportFilesClick)
      return (
        <button
          type="button"
          onClick={() => {
            onImportFilesClick();
          }}
          className="btn btn-primary"
        >
          {text}
        </button>
      );
    else throw new Error('getImportFilesLink or onImportFilesClick must be defined');
  }, [getImportFilesLink, onImportFilesClick]);

  const createDirectoryButton = useMemo(() => {
    if (getCreateDirectoryLink && onCreateDirectoryClick) throw new Error('getCreateDirectoryLink and onCreateDirectory cannot be both defined');

    const text = 'Nouveau dossier';

    if (getCreateDirectoryLink)
      return (
        <Link {...getCreateDirectoryLink()} preload="intent" className="btn btn-primary-light">
          {text}
        </Link>
      );
    else if (onCreateDirectoryClick)
      return (
        <button
          type="button"
          onClick={() => {
            onCreateDirectoryClick();
          }}
          className="btn btn-primary-light"
        >
          {text}
        </button>
      );
    else throw new Error('getCreateDirectoryLink or onCreateDirectoryClick must be defined');
  }, [getCreateDirectoryLink, onCreateDirectoryClick]);

  if (canMakeAction)
    return (
      <div className={styles.buttons_container}>
        {importFilesButton}
        {createDirectoryButton}
        <RefreshButtonComponent className="btn btn-primary" onRefresh={refetch} isRefreshing={isRefetching} />
      </div>
    );
}
