export const rdvUserInfosQueryKeys = {
  all: ['rdv-user-infos'] as const,
  lists: () => [...rdvUserInfosQueryKeys.all, 'lists'] as const,
  listAll: () => [...rdvUserInfosQueryKeys.lists(), 'all'] as const,
  listByRdvId: (rdvId: string) => [...rdvUserInfosQueryKeys.lists(), { rdvId }] as const,
};
