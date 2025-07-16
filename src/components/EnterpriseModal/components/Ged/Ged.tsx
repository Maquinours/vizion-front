import FileType from '../../../../utils/enums/FileType';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import GedComponent from '../../../Ged/Ged';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');
// const routePath = '/app/enterprises/$enterpriseId';

type EnterpriseModalComponentGedComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onCreateDirectoryClick: (data?: FileDataTreeResponseDto) => void;
  onImportFilesClick: (data?: FileDataTreeResponseDto) => void;
  onDeleteClick: (data: FileDataTreeResponseDto) => void;
  onRenameClick: (data: FileDataTreeResponseDto) => void;
}>;
export default function EnterpriseModalComponentGedComponent({
  enterprise,
  onCreateDirectoryClick,
  onImportFilesClick,
  onDeleteClick,
  onRenameClick,
}: EnterpriseModalComponentGedComponentProps) {
  // const { enterpriseId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.CONTACT}
      id={enterprise.id}
      onCreateDirectoryClick={onCreateDirectoryClick}
      onImportFilesClick={onImportFilesClick}
      onDeleteClick={onDeleteClick}
      onRenameClick={onRenameClick}
      // getCreateDirectoryLink={(data) => ({
      //   from: routePath,
      //   to: '/app/enterprises/$enterpriseId/create-ged-directory',
      //   search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      // getImportFilesLink={(data) => ({
      //   from: routePath,
      //   to: '/app/enterprises/$enterpriseId/import-ged-files',
      //   search: (old) => ({
      //     ...old,
      //     gedObjectRelativePath: data?.relativePath ?? '',
      //   }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      // getDeleteLink={(data) => ({
      //   from: routePath,
      //   to: '/app/enterprises/$enterpriseId/delete-ged-object/$objectRelativePath',
      //   search: true,
      //   params: (old) => ({
      //     ...old,
      //     objectRelativePath: encodeURIComponent(data.relativePath),
      //   }),
      //   replace: true,
      //   resetScroll: false,
      // })}
      // getRenameLink={(data) => ({
      //   from: routePath,
      //   to: '/app/enterprises/$enterpriseId/rename-ged-object/$objectRelativePath',
      //   search: true,
      //   params: (old) => ({ ...old, objectRelativePath: encodeURIComponent(data.relativePath) }),
      //   replace: true,
      //   resetScroll: false,
      // })}
    />
  );
}
