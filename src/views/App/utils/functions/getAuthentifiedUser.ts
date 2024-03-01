import { useSuspenseQuery } from '@tanstack/react-query';
import { getAuthentifiedUser } from '../api/authentifiedUser';

export const useAuthentifiedUserQuery = () =>
  useSuspenseQuery({
    queryKey: ['authentified-user'],
    queryFn: getAuthentifiedUser,
  });
