import FileType from '../../../../utils/enums/FileType';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import TechnicalSupportResponseDto from '../../../../utils/types/TechnicalSupportResponseDto';
import GedComponent from '../../../Ged/Ged';
import styles from './Ged.module.scss';

type AssistanceModalComponentGedComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
  onCreateDirectoryClick: (data?: FileDataTreeResponseDto) => void;
  onImportFilesClick: (data?: FileDataTreeResponseDto) => void;
  onRenameClick: (data: FileDataTreeResponseDto) => void;
  onDeleteClick: (data: FileDataTreeResponseDto) => void;
}>;
export default function AssistanceModalComponentGedComponent({
  assistance,
  onCreateDirectoryClick,
  onImportFilesClick,
  onRenameClick,
  onDeleteClick,
}: AssistanceModalComponentGedComponentProps) {
  return (
    <GedComponent
      type={FileType.ASSISTANCE}
      id={assistance.id}
      className={styles.card}
      onCreateDirectoryClick={onCreateDirectoryClick}
      // getCreateDirectoryLink={(data) => ({
      //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-ged-directory',
      //   params: (old) => old,
      //   search: (old) => ({ ...old, relativePath: data?.relativePath }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      onImportFilesClick={onImportFilesClick}
      // getImportFilesLink={(data) => ({
      //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/import-ged-files',
      //   params: (old) => old,
      //   search: (old) => ({ ...old, directoryRelativePath: data?.relativePath }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      onRenameClick={onRenameClick}
      // getRenameLink={(data) => ({
      //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/rename-ged-object/$objectRelativePath',
      //   params: (old) => ({ ...old, objectRelativePath: data.relativePath }),
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
      onDeleteClick={onDeleteClick}
      // getDeleteLink={(data) => ({
      //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/delete-ged-object/$objectRelativePath',
      //   params: (old) => ({ ...old, objectRelativePath: data.relativePath }),
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
    />
  );
}
