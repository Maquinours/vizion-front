import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllDepartments } from '../../api/department';

export const departments = createQueryKeys('department', {
  list: { queryKey: null, queryFn: getAllDepartments },
});
