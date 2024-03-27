type ProductShelfResponseDto = {
  id: string;
  number: string | null;
  note: string | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductShelfResponseDto;
