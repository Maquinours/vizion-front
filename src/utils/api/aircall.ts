import { aircallInstance } from '../functions/axios';
import AircallUsersResponseDto from '../types/AircallUsersResponseDto';

export const getAllAircallUsers = async () => {
  return aircallInstance<AircallUsersResponseDto>({ method: 'GET', url: '/users' }).then((res) => res.data);
};
