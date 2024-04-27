import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllDepartments, getDepartmentById, getDepartmentsPage, getDepartmentByCode } from '../../api/department';

export const departments = createQueryKeys('departments', {
  list: {
    queryKey: null,
    queryFn: getAllDepartments,
  },
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getDepartmentsPage({ page, size }),
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getDepartmentById(id),
      }),
      byCode: (code: string) => ({
        queryKey: [code],
        queryFn: () => getDepartmentByCode(code),
      }),
    },
  },
});
