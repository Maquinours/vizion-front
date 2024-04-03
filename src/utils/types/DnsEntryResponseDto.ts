type DnsEntryResponseDto = {
  id: string;
  enterpriseId: string | null;
  enterpriseName: string | null;
  profileId: string | null;
  profileName: string | null;
  idDomain: number;
  domainName: string;
  url: string;
  ip: string;
  domain: string;
  email: string | null;
  productReference: string | null;
  productSerialNumber: string | null;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default DnsEntryResponseDto;
