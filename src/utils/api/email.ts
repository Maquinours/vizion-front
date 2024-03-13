import { privateInstance } from '../functions/axios';
import MailResponseDto from '../types/MailResponseDto';

export const getEmailById = async (id: string) => {
  return (
    await privateInstance<MailResponseDto>({
      method: 'GET',
      url: `/mail/v1/${encodeURIComponent(id)}`,
    })
  ).data;
};
