type RdvResponseDto = {
  id: string;
  title: string;
  description: string | null;
  place: string | null;
  fullTime: boolean | null;
  startDateTime: string | null;
  endDatetime: string | null;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default RdvResponseDto;
