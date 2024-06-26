import { getRouteApi, useNavigate } from '@tanstack/react-router';
import GedComponent from '../../../../../../components/Ged/Ged';
import FileType from '../../../../../../utils/enums/FileType';
import styles from './Body.module.scss';
import CreateGedDirectoryModalComponent from '../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import ImportGedFilesModalComponent from '../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import RenameGedObjectModalComponent from '../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import DeleteGedObjectModalComponent from '../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';

const Route = getRouteApi('/app');

export default function AppViewBusinessGedModalComponentBodyComponent() {
  const navigate = useNavigate();

  const { businessId, appModal: modalId, gedItemKey } = Route.useSearch();

  const gedObjectRelativePath = decodeURIComponent(gedItemKey ?? '');

  const modal = (() => {
    if (modalId === 'business-ged-create-dir')
      return (
        <CreateGedDirectoryModalComponent
          type={FileType.AFFAIRE}
          id={businessId!}
          directoryRelativePath={gedObjectRelativePath}
          onClose={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        />
      );
    if (modalId === 'business-ged-import-files')
      return (
        <ImportGedFilesModalComponent
          type={FileType.AFFAIRE}
          id={businessId!}
          directoryRelativePath={gedObjectRelativePath}
          onClose={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        />
      );
    if (modalId === 'business-ged-rename')
      return (
        <RenameGedObjectModalComponent
          type={FileType.AFFAIRE}
          id={businessId!}
          objectRelativePath={gedObjectRelativePath}
          onClose={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        />
      );
    if (modalId === 'business-ged-delete')
      return (
        <DeleteGedObjectModalComponent
          type={FileType.AFFAIRE}
          id={businessId!}
          objectRelativePath={gedObjectRelativePath}
          onClose={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        />
      );
  })();

  return (
    <>
      <div className={styles.modal_content}>
        <GedComponent
          type={FileType.AFFAIRE}
          id={businessId!}
          canMakeAction={true}
          getCreateDirectoryLink={(data) => ({
            search: (old) => ({ ...old, appModal: 'business-ged-create-dir', gedItemKey: data?.relativePath ?? '' }),
            params: (old) => old,
          })}
          getImportFilesLink={(data) => ({
            search: (old) => ({ ...old, appModal: 'business-ged-import-files', gedItemKey: data?.relativePath ?? '' }),
            params: (old) => old,
          })}
          getRenameLink={(data) => ({
            search: (old) => ({ ...old, appModal: 'business-ged-rename', gedItemKey: data.relativePath }),
            params: (old) => old,
          })}
          getDeleteLink={(data) => ({
            search: (old) => ({ ...old, appModal: 'business-ged-delete', gedItemKey: data.relativePath }),
            params: (old) => old,
          })}
        />
      </div>
      {modal}
    </>
  );
}
