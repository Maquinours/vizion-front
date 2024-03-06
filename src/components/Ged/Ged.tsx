import { useQuery } from '@tanstack/react-query';
import { gedQueryKeys } from '../../utils/constants/queryKeys/ged';
import FileType from '../../utils/enums/FileType';
import { getDirectoryByTypeAndIdOnS3 } from '../../utils/api/ged';
import CommonCard from '../Card/Card';
import GedComponentButtonsComponent from './components/Buttons/Buttons';
import GedComponentTableComponent from './components/Table/Table';
import GedComponentCreateDirectoryModalComponent from './components/CreateDirectoryModal/CreateDirectoryModal';
import FileDataTreeResponseDto from '../../utils/types/FileDataTreeResponseDto';
import GedComponentImportFilesModalComponent from './components/ImportFilesModal/ImportFilesModal';
import GedComponentRenameModalComponent from './components/RenameModal/RenameModal';
import GedComponentDeleteModalComponent from './components/DeleteModal/DeleteModal';

type GedComponentProps = Readonly<{
  type: FileType;
  id: string;
  canMakeAction?: boolean;
  openCreateDirectoryModal: (item?: FileDataTreeResponseDto) => void;
  openImportFilesModal: (item?: FileDataTreeResponseDto) => void;
  openRenameModal: (item: FileDataTreeResponseDto) => void;
  openDeleteModal: (item: FileDataTreeResponseDto) => void;
  closeCreateDirectoryModal: () => void;
  closeImportFilesModal: () => void;
  closeRenameModal: () => void;
  closeDeleteModal: () => void;
  modal: 'create-directory' | 'import-files' | 'rename' | 'delete' | undefined;
  element?: FileDataTreeResponseDto;
}>;
export default function GedComponent({
  type,
  id,
  canMakeAction = true,
  openCreateDirectoryModal,
  openImportFilesModal,
  openRenameModal,
  openDeleteModal,
  closeCreateDirectoryModal,
  closeImportFilesModal,
  closeRenameModal,
  closeDeleteModal,
  modal,
  element,
}: GedComponentProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: gedQueryKeys.detailByTypeAndId(type, id),
    queryFn: () => getDirectoryByTypeAndIdOnS3(type, id),
  });

  const modalElement = (() => {
    switch (modal) {
      case 'create-directory':
        return <GedComponentCreateDirectoryModalComponent id={id} type={type} directory={element} onClose={closeCreateDirectoryModal} />;
      case 'import-files':
        return <GedComponentImportFilesModalComponent directory={element} id={id} type={type} onClose={closeImportFilesModal} />;
      case 'rename':
        return <GedComponentRenameModalComponent id={id} type={type} item={element!} onClose={closeRenameModal} />;
      case 'delete':
        return <GedComponentDeleteModalComponent type={type} id={id} item={element!} onClose={closeDeleteModal} />;
    }
  })();

  return (
    <>
      <CommonCard title="Gestion électronique de documents">
        <div>
          <GedComponentButtonsComponent
            canMakeAction={canMakeAction}
            openImportFilesModal={openImportFilesModal}
            openCreateDirectoryModal={openCreateDirectoryModal}
            onReload={refetch}
          />
          <GedComponentTableComponent
            isLoading={isLoading}
            data={data}
            canMakeAction={canMakeAction}
            openCreateDirectoryModal={openCreateDirectoryModal}
            openImportFilesModal={openImportFilesModal}
            openRenameModal={openRenameModal}
            openDeleteModal={openDeleteModal}
          />
        </div>
      </CommonCard>
      {modalElement}
    </>
  );
}
