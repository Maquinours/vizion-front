import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllPredefinedMessages, getPredefinedMessageById, getPredefinedMessagesPage } from '../../api/predefinedMessage';

export const predefinedMessages = createQueryKeys('predefined-message', {
  list: {
    queryKey: null,
    queryFn: getAllPredefinedMessages,
  },
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getPredefinedMessagesPage(page, size),
  }),
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getPredefinedMessageById(id),
  }),
});
