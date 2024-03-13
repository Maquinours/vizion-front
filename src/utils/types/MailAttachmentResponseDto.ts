type MailAttachmentResponseDto = {
  id: string;
  name: string | null;
  path: string | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default MailAttachmentResponseDto;
