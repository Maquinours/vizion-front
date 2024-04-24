import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllDepartments, getDepartmentByCode } from '../../api/department';

export const departments = createQueryKeys('departments', {
  list: {
    queryKey: null,
    queryFn: getAllDepartments,
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byCode: (code: string) => ({
        queryKey: [code],
        queryFn: () => getDepartmentByCode(code),
      }),
    },
  },
});
