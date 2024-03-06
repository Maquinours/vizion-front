import FileType from '../../enums/FileType';

export const gedQueryKeys = {
  all: ['ged'] as const,
  details: () => [...gedQueryKeys.all, 'detail'] as const,
  detailByTypeAndId: (type: FileType, id: string) => [...gedQueryKeys.details(), { type, id }] as const,
};
