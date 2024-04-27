import { privateInstance } from '../functions/axios';
import DepartmentRequestDto from '../types/DepartmentRequestDto';
import DepartmentResponseDto from '../types/DepartmentResponseDto';
import Page from '../types/Page';

export const getAllDepartments = async () => {
  return (
    await privateInstance<Array<DepartmentResponseDto>>({
      method: 'GET',
      url: `/profile/v1/department/all`,
    })
  ).data;
};

export const updateDepartment = (id: string, data: DepartmentRequestDto) => {
  return privateInstance<DepartmentResponseDto>({
    method: 'PUT',
    url: `profile/v1/department/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const getDepartmentsPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<DepartmentResponseDto>>({
    method: 'GET',
    url: `/profile/v1/department/all/page`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const deleteDepartment = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `profile/v1/department/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getDepartmentById = (id: string) => {
  return privateInstance<DepartmentResponseDto>({
    method: 'GET',
    url: `profile/v1/department/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const createDepartment = (data: DepartmentRequestDto) => {
  return privateInstance<DepartmentResponseDto>({
    method: 'POST',
    url: `profile/v1/department/`,
    data,
  }).then((res) => res.data);
};
