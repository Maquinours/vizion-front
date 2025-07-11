import { createContext } from 'react';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import { LinkOptions } from '@tanstack/react-router';

type GedContextType = Readonly<{
  canMakeAction: boolean;
  getCreateDirectoryLink?: (data?: FileDataTreeResponseDto) => LinkOptions;
  onCreateDirectoryClick?: (data?: FileDataTreeResponseDto) => void;
  getImportFilesLink?: (data?: FileDataTreeResponseDto) => LinkOptions;
  onImportFilesClick?: (data?: FileDataTreeResponseDto) => void;
  getRenameLink?: (data: FileDataTreeResponseDto) => LinkOptions;
  onRenameClick?: (data: FileDataTreeResponseDto) => void;
  getDeleteLink?: (data: FileDataTreeResponseDto) => LinkOptions;
  onDeleteClick?: (data: FileDataTreeResponseDto) => void;
}>;

export const GedContext = createContext<GedContextType | undefined>(undefined);
