import { useQuery } from '@tanstack/react-query';
import { LinkOptions } from '@tanstack/react-router';
import { useMemo } from 'react';
import { geds } from '../../utils/constants/queryKeys/ged';
import FileType from '../../utils/enums/FileType';
import FileDataTreeResponseDto from '../../utils/types/FileDataTreeResponseDto';
import CardComponent from '../Card/Card';
import GedComponentButtonsComponent from './components/Buttons/Buttons';
import GedComponentTableComponent from './components/Table/Table';
import { GedContext } from './utils/contexts/ged';

type GedComponentProps = Readonly<{
  type: FileType;
  id: string;
  canMakeAction?: boolean;
  getCreateDirectoryLink: (data?: FileDataTreeResponseDto) => LinkOptions;
  getImportFilesLink: (data?: FileDataTreeResponseDto) => LinkOptions;
  getRenameLink: (data: FileDataTreeResponseDto) => LinkOptions;
  getDeleteLink: (data: FileDataTreeResponseDto) => LinkOptions;
  className?: string;
}>;
export default function GedComponent({
  type,
  id,
  canMakeAction = true,
  getCreateDirectoryLink,
  getImportFilesLink,
  getRenameLink,
  getDeleteLink,
  className,
}: GedComponentProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    ...geds.detail._ctx.byTypeAndId(type, id),
    select: (data) => data.at(0)?.subRows ?? [],
  });

  const gedContextValue = useMemo(
    () => ({ canMakeAction, getCreateDirectoryLink, getImportFilesLink, getRenameLink, getDeleteLink }),
    [canMakeAction, getCreateDirectoryLink, getImportFilesLink, getRenameLink, getDeleteLink],
  );

  return (
    <CardComponent title="Gestion électronique de documents" className={className}>
      <div>
        <GedContext.Provider value={gedContextValue}>
          <GedComponentButtonsComponent refetch={refetch} isRefetching={isRefetching} />
          <GedComponentTableComponent isLoading={isLoading} data={data} />
        </GedContext.Provider>
      </div>
    </CardComponent>
  );
}
