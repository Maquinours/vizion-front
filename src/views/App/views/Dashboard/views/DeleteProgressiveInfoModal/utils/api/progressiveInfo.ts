import { privateInstance } from '../../../../../../../../utils/functions/axios';

export const deleteProgressiveInfo = async (id: string) => {
  return (
    await privateInstance<void>({
      method: 'DELETE',
      url: `/progressive-info/v1/progressive-info/delete?id=${encodeURIComponent(id)}`,
    })
  ).data;
};
