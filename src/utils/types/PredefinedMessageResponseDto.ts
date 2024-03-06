type PredefinedMessageResponseDto = {
  id: string;
  title: string;
  description: string;
  orderNum: number | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string;
  modifiedBy: string | null;
};

export default PredefinedMessageResponseDto;
