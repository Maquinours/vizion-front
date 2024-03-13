import { privateInstance } from '../../../../../../../../utils/functions/axios';

export const deleteTasks = async (ids: Array<string>) => {
  return (
    await privateInstance<void>({
      method: 'DELETE',
      url: `/workloads/v1/tasks/delete-all`,
      params: {
        ids: ids,
      },
    })
  ).data;
};
