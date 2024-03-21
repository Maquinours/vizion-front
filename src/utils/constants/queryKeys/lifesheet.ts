import { LifesheetAssociatedItem } from '../../enums/LifesheetAssociatedItem';

export const lifesheetQueryKeys = {
  all: ['lifesheet'] as const,
  pages: () => ['lifesheet', 'page'] as const,
  pageByAssociatedItemAndId: (associatedItem: LifesheetAssociatedItem, itemId: string, page: number, size: number) =>
    [...lifesheetQueryKeys.pages(), { associatedItem, itemId, page, size }] as const,
};
