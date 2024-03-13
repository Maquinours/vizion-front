import MailType from '../enums/MailType';
import MailAttachmentResponseDto from './MailAttachmentResponseDto';

type MailResponseDto = {
  id: string;
  type: MailType | null;
  subject: string | null;
  cc: string | null;
  bcc: string | null;
  sender: string;
  receiver: string;
  ownerId: string;
  content: string;
  treated: boolean;
  typeText: string;
  isVizeo: boolean;
  mailID: string;
  sendDate: string | null;
  pjList: MailAttachmentResponseDto[];
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default MailResponseDto;
