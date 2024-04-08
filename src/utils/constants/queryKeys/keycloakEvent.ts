import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getLatestKeycloakEvents } from '../../../views/App/views/Dashboard/components/LatestConnections/utils/api/keycloakEvents';

export const keycloakEvents = createQueryKeys('keycloak-events', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getLatestKeycloakEvents(page, size),
  }),
});
