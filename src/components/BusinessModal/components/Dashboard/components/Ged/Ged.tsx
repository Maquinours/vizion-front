// import { getRouteApi } from '@tanstack/react-router';
// import GedComponent from '../../../../../../../../components/Ged/Ged';
// import FileType from '../../../../../../../../utils/enums/FileType';

import FileType from '../../../../../../utils/enums/FileType';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import FileDataTreeResponseDto from '../../../../../../utils/types/FileDataTreeResponseDto';
import GedComponent from '../../../../../Ged/Ged';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');

type BusinessModalComponentDashboardComponentGedComponentProps = Readonly<{
  business: BusinessResponseDto;
  onCreateDirectoryClick: (data?: FileDataTreeResponseDto) => void;
  onImportFilesClick: (data?: FileDataTreeResponseDto) => void;
  onRenameClick: (data: FileDataTreeResponseDto) => void;
  onDeleteClick: (data: FileDataTreeResponseDto) => void;
}>;
export default function BusinessModalComponentDashboardComponentGedComponent({
  business,
  onCreateDirectoryClick,
  onImportFilesClick,
  onRenameClick,
  onDeleteClick,
}: BusinessModalComponentDashboardComponentGedComponentProps) {
  //   const { businessId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.AFFAIRE}
      id={business.id}
      onCreateDirectoryClick={onCreateDirectoryClick}
      onImportFilesClick={onImportFilesClick}
      onRenameClick={onRenameClick}
      onDeleteClick={onDeleteClick}
      //   getCreateDirectoryLink={(data) => ({
      //     to: '/app/businesses-rma/business/$businessId/dashboard/create-ged-directory',
      //     search: (old) => ({ ...old, relativePath: data?.relativePath ?? '' }),
      //     replace: true,
      //     resetScroll: false,
      //     ignoreBlocker: true,
      //   })}
      //   getImportFilesLink={(data) => ({
      //     to: '/app/businesses-rma/business/$businessId/dashboard/import-ged-files',
      //     search: (old) => ({ ...old, relativePath: data?.relativePath ?? '' }),
      //     replace: true,
      //     resetScroll: false,
      //     ignoreBlocker: true,
      //   })}
      //   getRenameLink={(data) => ({
      //     to: '/app/businesses-rma/business/$businessId/dashboard/rename-ged-object/$objectRelativePath',
      //     params: { objectRelativePath: data.relativePath },
      //     search: true,
      //     replace: true,
      //     resetScroll: false,
      //     ignoreBlocker: true,
      //   })}
      //   getDeleteLink={(data) => ({
      //     to: '/app/businesses-rma/business/$businessId/dashboard/delete-ged-object/$objectRelativePath',
      //     params: { objectRelativePath: data.relativePath },
      //     search: true,
      //     replace: true,
      //     resetScroll: false,
      //     ignoreBlocker: true,
      //   })}
    />
  );
}
