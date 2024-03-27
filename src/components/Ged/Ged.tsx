import { useQuery } from '@tanstack/react-query';
import { gedQueryKeys } from '../../utils/constants/queryKeys/ged';
import FileType from '../../utils/enums/FileType';
import { getDirectoryByTypeAndIdOnS3 } from '../../utils/api/ged';
import GedComponentButtonsComponent from './components/Buttons/Buttons';
import GedComponentTableComponent from './components/Table/Table';
import CardComponent from '../Card/Card';
import { GedContext } from './utils/contexts/ged';
import FileDataTreeResponseDto from '../../utils/types/FileDataTreeResponseDto';
import { useMemo } from 'react';
import { LinkOptions } from '@tanstack/react-router';

type GedComponentProps = Readonly<{
  type: FileType;
  id: string;
  canMakeAction?: boolean;
  getCreateDirectoryLink: (data?: FileDataTreeResponseDto) => LinkOptions;
  getImportFilesLink: (data?: FileDataTreeResponseDto) => LinkOptions;
  getRenameLink: (data: FileDataTreeResponseDto) => LinkOptions;
  getDeleteLink: (data: FileDataTreeResponseDto) => LinkOptions;
}>;
export default function GedComponent({
  type,
  id,
  canMakeAction = true,
  getCreateDirectoryLink,
  getImportFilesLink,
  getRenameLink,
  getDeleteLink,
}: GedComponentProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: gedQueryKeys.detailByTypeAndId(type, id),
    queryFn: () => getDirectoryByTypeAndIdOnS3(type, id),
    select: (data) => data.at(0)?.subRows ?? [],
  });

  const gedContextValue = useMemo(
    () => ({ canMakeAction, getCreateDirectoryLink, getImportFilesLink, getRenameLink, getDeleteLink }),
    [canMakeAction, getCreateDirectoryLink, getImportFilesLink, getRenameLink, getDeleteLink],
  );

  return (
    <CardComponent title="Gestion électronique de documents">
      <div>
        <GedContext.Provider value={gedContextValue}>
          <GedComponentButtonsComponent refetch={refetch} isRefetching={isRefetching} />
          <GedComponentTableComponent isLoading={isLoading} data={data} />
        </GedContext.Provider>
      </div>
    </CardComponent>
  );
}
