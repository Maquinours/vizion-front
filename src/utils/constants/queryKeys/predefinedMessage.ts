import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllPredefinedMessages } from '../../api/predefinedMessage';

export const predefinedMessages = createQueryKeys('predefined-message', {
  list: {
    queryKey: null,
    queryFn: getAllPredefinedMessages,
  },
});
