import TaskState from '../enums/TaskState';
import WorkloadType from '../enums/WorkloadType';
import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import TaskRequestDto from '../types/TaskRequestDto';
import TaskResponseDto from '../types/TaskResponseDto';
import TasksPageWithCountsResponseDto from '../types/TasksCountsResponseDto';

export const createTask = async (task: TaskRequestDto) => {
  return (
    await privateInstance<TaskResponseDto>({
      method: 'POST',
      url: '/workloads/v1/tasks/add',
      data: task,
    })
  ).data;
};

export const updateTask = async (id: string, profileId: string, state: TaskState, data: TaskRequestDto) => {
  return (
    await privateInstance<TaskResponseDto>({
      method: 'PUT',
      url: `/workloads/v1/tasks/update`,
      params: {
        id,
        state,
        profileId,
      },
      data,
    })
  ).data;
};

export const getTasksByType = async (type: WorkloadType) => {
  return (
    await privateInstance<Array<TaskResponseDto>>({
      method: 'GET',
      url: `/workloads/v1/tasks/all-by-type`,
      params: {
        type: type,
      },
    })
  ).data;
};

export const attributeTask = async (id: string, profileId: string, senderId: string, copy: boolean) => {
  return (
    await privateInstance({
      method: 'POST',
      url: `/workloads/v1/tasks/attribute`,
      params: {
        id,
        profileId,
        senderId,
        copy,
      },
    })
  ).data as TaskResponseDto;
};

export const getTaskById = async (id: string) => {
  return (
    await privateInstance<TaskResponseDto>({
      method: 'GET',
      url: `/workloads/v1/tasks/${encodeURIComponent(id)}`,
    })
  ).data;
};

export const getPaginatedTasksByStateAndProfileId = async (state: TaskState, profileId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<TaskResponseDto>>({
      method: 'GET',
      url: `/workloads/v1/tasks/all-by-profile-and-state-paged`,
      params: {
        profileId,
        state,
        page,
        size,
      },
    })
  ).data;
};

export const getTasksPageByEnterpriseId = async (enterpriseId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<TaskResponseDto>>({
      method: 'GET',
      url: `/workloads/v1/tasks/all-by-enterprise-paged`,
      params: {
        enterpriseId,
        page,
        size,
      },
    })
  ).data;
};

export const getTasksPageByProductId = (productId: string, page: number, size: number) => {
  return privateInstance<Page<TaskResponseDto>>({
    method: 'GET',
    url: `/workloads/v1/tasks/all-by-product-paged`,
    params: {
      productId,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getTasksPageByBusinessId = (businessId: string, { page, size }: { page: number; size: number }) => {
  return privateInstance<Page<TaskResponseDto>>({
    method: 'GET',
    url: `/workloads/v1/tasks/all-by-business-paged`,
    params: {
      businessId,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getTasksPageByRmaId = (rmaId: string, { page, size }: { page: number; size: number }) => {
  return privateInstance<Page<TaskResponseDto>>({
    method: 'GET',
    url: `/workloads/v1/tasks/all-by-rma-paged`,
    params: {
      rmaId,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getUnreadTasksCountByProfileId = async (profileId: string) => {
  return privateInstance<number>({
    method: 'GET',
    url: `/workloads/v1/tasks/count-unread/${encodeURIComponent(profileId)}`,
  }).then((res) => res.data);
};

export const getTasksCounts = async (profileId: string) => {
  return (
    await privateInstance<TasksPageWithCountsResponseDto>({
      method: 'GET',
      url: `/workloads/v1/tasks/counts-by-profile/${encodeURIComponent(profileId)}`,
    })
  ).data;
};
