import styles from './Buttons.module.scss';
import { useContext } from 'react';
import { GedContext } from '../../utils/contexts/ged';
import { Link } from '@tanstack/react-router';
import RefreshButtonComponent from '../../../RefreshButton/RefreshButton';

type GedComponentButtonsComponentProps = Readonly<{
  refetch: () => void;
  isRefetching: boolean;
}>;
export default function GedComponentButtonsComponent({ refetch, isRefetching }: Readonly<GedComponentButtonsComponentProps>) {
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
        <RefreshButtonComponent className="btn btn-primary" onRefresh={refetch} isRefreshing={isRefetching} />
      </div>
    );
}
