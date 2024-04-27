import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllDepartments, getDepartmentById, getDepartmentsPage } from '../../api/department';

export const departments = createQueryKeys('departments', {
  list: {
    queryKey: null,
    queryFn: getAllDepartments,
  },
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getDepartmentsPage({ page, size }),
  }),
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getDepartmentById(id),
  }),
});
