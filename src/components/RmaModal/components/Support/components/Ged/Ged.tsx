import FileType from '../../../../../../utils/enums/FileType';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import GedComponent from '../../../../../Ged/Ged';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

type RmaModalComponentSupportComponentGedComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onCreateDirectoryClick: () => void;
  onImportFilesClick: () => void;
  onRenameClick: () => void;
  onDeleteClick: () => void;
}>;
export default function RmaModalComponentSupportComponentGedComponent({
  rma,
  onCreateDirectoryClick,
  onImportFilesClick,
  onRenameClick,
  onDeleteClick,
}: RmaModalComponentSupportComponentGedComponentProps) {
  // const { rmaId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.SAV}
      id={rma.id}
      onCreateDirectoryClick={onCreateDirectoryClick}
      // getCreateDirectoryLink={(object) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/create-ged-directory',
      //   search: (old) => ({ ...old, relativePath: object?.relativePath }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      onImportFilesClick={onImportFilesClick}
      // getImportFilesLink={(object) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/import-ged-files',
      //   search: (old) => ({ ...old, relativePath: object?.relativePath }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      onRenameClick={onRenameClick}
      // getRenameLink={(object) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/rename-ged-object/$objectRelativePath',
      //   params: { objectRelativePath: object.relativePath },
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
      onDeleteClick={onDeleteClick}
      // getDeleteLink={(object) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/delete-ged-object/$relativePath',
      //   params: { relativePath: object.relativePath },
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
    />
  );
}
