export const keycloakEventQueryKeys = {
  all: ['keycloak-events'] as const,
  pages: () => [...keycloakEventQueryKeys.all, 'page'] as const,
  page: (page: number, size: number) => [...keycloakEventQueryKeys.pages(), { page, size }] as const,
};
