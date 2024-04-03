export const ddnsQueryKeys = {
  all: ['ddns'] as const,
  exists: () => [...ddnsQueryKeys.all, 'exists'] as const,
  existsBySubDomain: (subDomain: string) => [...ddnsQueryKeys.exists(), { subDomain }] as const,
  pages: () => [...ddnsQueryKeys.all, 'page'] as const,
  pageWithSearch: (
    email: string | undefined,
    domain: string | undefined,
    serial: string | undefined,
    ref: string | undefined,
    date: Date | undefined,
    page: number,
    size: number,
  ) => [...ddnsQueryKeys.pages(), { email, domain, serial, ref, date, page, size }] as const,
  details: () => [...ddnsQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...ddnsQueryKeys.details(), { id }] as const,
};
