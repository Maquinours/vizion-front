import { getRouteApi, useNavigate } from '@tanstack/react-router';
import GedComponent from '../../../../../../components/Ged/Ged';
import FileType from '../../../../../../utils/enums/FileType';
import styles from './Body.module.scss';

const Route = getRouteApi('/app');

export default function AppViewBusinessGedModalComponentBodyComponent() {
  const navigate = useNavigate();

  const { businessId, appModal: modalId } = Route.useSearch();

  const modal = (() => {
    if (modalId === 'business-ged-create-dir') return 'create-directory';
    if (modalId === 'business-ged-import-files') return 'import-files';
    if (modalId === 'business-ged-rename') return 'rename';
    if (modalId === 'business-ged-delete') return 'delete';
  })();

  return (
    <div className={styles.modal_content}>
      <GedComponent
        type={FileType.AFFAIRE}
        id={businessId!}
        canMakeAction={true}
        openCreateDirectoryModal={(item) =>
          navigate({ search: (old) => ({ ...old, appModal: 'business-ged-create-dir', gedItemKey: item?.key }), params: (old) => old })
        }
        openImportFilesModal={(item) =>
          navigate({ search: (old) => ({ ...old, appModal: 'business-ged-import-files', gedItemKey: item?.key }), params: (old) => old })
        }
        openRenameModal={(item) => navigate({ search: (old) => ({ ...old, appModal: 'business-ged-rename', gedItemKey: item.key }), params: (old) => old })}
        openDeleteModal={(item) => navigate({ search: (old) => ({ ...old, appModal: 'business-ged-delete', gedItemKey: item.key }), params: (old) => old })}
        closeCreateDirectoryModal={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        closeImportFilesModal={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        closeRenameModal={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        closeDeleteModal={() => navigate({ search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), params: (old) => old })}
        modal={modal}
      />
    </div>
  );
}
