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
  getCreateDirectoryLink?: (data?: FileDataTreeResponseDto) => LinkOptions;
  onCreateDirectoryClick?: (data?: FileDataTreeResponseDto) => void;
  getImportFilesLink?: (data?: FileDataTreeResponseDto) => LinkOptions;
  onImportFilesClick?: (data?: FileDataTreeResponseDto) => void;
  getRenameLink?: (data: FileDataTreeResponseDto) => LinkOptions;
  onRenameClick?: (data: FileDataTreeResponseDto) => void;
  getDeleteLink?: (data: FileDataTreeResponseDto) => LinkOptions;
  onDeleteClick?: (data: FileDataTreeResponseDto) => void;
  className?: string;
}>;
export default function GedComponent({
  type,
  id,
  canMakeAction = true,
  getCreateDirectoryLink,
  onCreateDirectoryClick,
  getImportFilesLink,
  onImportFilesClick,
  getRenameLink,
  onRenameClick,
  getDeleteLink,
  onDeleteClick,
  className,
}: GedComponentProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    ...geds.detail._ctx.byTypeAndId(type, id),
    select: (data) => data.at(0)?.subRows ?? [],
  });

  const gedContextValue = useMemo(
    () => ({
      canMakeAction,
      getCreateDirectoryLink,
      onCreateDirectoryClick,
      getImportFilesLink,
      onImportFilesClick,
      getRenameLink,
      onRenameClick,
      getDeleteLink,
      onDeleteClick,
    }),
    [
      canMakeAction,
      getCreateDirectoryLink,
      onCreateDirectoryClick,
      getImportFilesLink,
      onImportFilesClick,
      getRenameLink,
      onRenameClick,
      getDeleteLink,
      onDeleteClick,
    ],
  );

  if (getCreateDirectoryLink && onCreateDirectoryClick) throw new Error('getCreateDirectoryLink and onCreateDirectoryClick cannot be both defined');
  if (!getCreateDirectoryLink && !onCreateDirectoryClick) throw new Error('getCreateDirectoryLink or onCreateDirectoryClick must be defined');
  if (getImportFilesLink && onImportFilesClick) throw new Error('getImportFilesLink and onImportFilesClick cannot be both defined');
  if (!getImportFilesLink && !onImportFilesClick) throw new Error('getImportFilesLink or onImportFilesClick must be defined');
  if (getRenameLink && onRenameClick) throw new Error('getRenameLink and onRenameClick cannot be both defined');
  if (!getRenameLink && !onRenameClick) throw new Error('getRenameLink or onRenameClick must be defined');
  if (getDeleteLink && onDeleteClick) throw new Error('getDeleteLink and onDeleteClick cannot be both defined');
  if (!getDeleteLink && !onDeleteClick) throw new Error('getDeleteLink or onDeleteClick must be defined');

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
