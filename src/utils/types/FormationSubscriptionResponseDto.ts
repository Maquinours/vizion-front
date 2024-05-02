type FormationSubscriptionResponseDto = {
  id: string;
  email: string | null;
  phoneNumber: string | null;
  lastName: string | null;
  firstName: string | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default FormationSubscriptionResponseDto;
