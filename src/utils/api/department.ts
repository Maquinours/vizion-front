import { privateInstance } from '../functions/axios';
import DepartmentRequestDto from '../types/DepartmentRequestDto';
import DepartmentResponseDto from '../types/DepartmentResponseDto';

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
