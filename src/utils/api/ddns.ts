import { privateInstance } from '../functions/axios';
import DnsEntryRequestDto from '../types/DnsEntryRequestDto';
import DnsEntryResponseDto from '../types/DnsEntryResponseDto';
import Page from '../types/Page';

export const getDdnsExistsBySubDomain = (dns: string) => {
  return privateInstance<boolean>({
    method: 'GET',
    url: `/ddns/v1/dns-entry/check-sub-domain`,
    params: {
      dns,
    },
  }).then((res) => res.data);
};

export const createDdns = (data: DnsEntryRequestDto) => {
  return privateInstance<DnsEntryResponseDto>({
    method: 'POST',
    url: `ddns/v1/dns-entry/`,
    data,
  }).then((res) => res.data);
};

export const getDdnsPageWithSearch = (
  email: string | undefined,
  domain: string | undefined,
  serial: string | undefined,
  ref: string | undefined,
  date: Date | undefined,
  page: number,
  size: number,
) => {
  return privateInstance<Page<DnsEntryResponseDto>>({
    method: 'GET',
    url: `ddns/v1/dns-entry/search`,
    params: {
      email,
      domain,
      serial,
      ref,
      date,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getDdnsPage = (page: number, size: number) => {
  return privateInstance<Page<DnsEntryResponseDto>>({
    method: 'GET',
    url: `ddns/v1/dns-entry/page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};

export const getDdnsById = (id: string) => {
  return privateInstance<DnsEntryResponseDto>({
    method: 'GET',
    url: `ddns/v1/dns-entry/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const deleteDdns = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `ddns/v1/dns-entry/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
