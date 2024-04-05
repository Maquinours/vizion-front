import { useSuspenseQuery } from '@tanstack/react-query';
import { users } from '../../../../utils/constants/queryKeys/user';

export const useAuthentifiedUserQuery = () => useSuspenseQuery(users.authentified());
