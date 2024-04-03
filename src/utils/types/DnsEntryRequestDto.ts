type DnsEntryRequestDto = {
  ip?: string | null;
  enterpriseId?: string | null;
  enterpriseName?: string | null;
  profileId?: string | null;
  profileName?: string | null;
  domainName?: string | null;
  email?: string | null;
  productReference?: string | null;
  productSerialNumber?: string | null;
};

export default DnsEntryRequestDto;
