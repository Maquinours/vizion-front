import { createContext } from 'react';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import { LinkOptions } from '@tanstack/react-router';

type GedContextType = Readonly<{
  canMakeAction: boolean;
  getCreateDirectoryLink: (data?: FileDataTreeResponseDto) => LinkOptions;
  getImportFilesLink: (data?: FileDataTreeResponseDto) => LinkOptions;
  getRenameLink: (data: FileDataTreeResponseDto) => LinkOptions;
  getDeleteLink: (data: FileDataTreeResponseDto) => LinkOptions;
}>;

export const GedContext = createContext<GedContextType | undefined>(undefined);
