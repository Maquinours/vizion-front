import { privateInstance } from '../functions/axios';
import DepartmentResponseDto from '../types/DepartmentResponseDto';

export const getAllDepartments = async () => {
  return (
    await privateInstance<Array<DepartmentResponseDto>>({
      method: 'GET',
      url: `/profile/v1/department/all`,
    })
  ).data;
};
