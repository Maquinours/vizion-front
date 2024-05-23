import SendEmailComponent from '../../../../../../components/SendEmail/SendEmail';

export default function AppViewToolsViewSendEmailView() {
  return <SendEmailComponent predefinedMessagesModalLink={{ to: '/app/tools/emails/send/predefined-messages', replace: true }} />;
}
