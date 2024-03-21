import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import SendEmailModalComponent from '../../../SendEmailModal/SendEmailModal';

type UpdateContactPasswordModalComponentStepThreeComponentProps = Readonly<{
  contact: ProfileResponseDto;
  onClose: () => void;
}>;
export default function UpdateContactPasswordModalComponentStepThreeComponent({
  contact,
  onClose,
}: UpdateContactPasswordModalComponentStepThreeComponentProps) {
  return (
    <SendEmailModalComponent
      isOpen={true}
      defaultRecipient={[contact.email!]}
      defaultSubject="VIZEO - Informations de connexion"
      defaultContent={`${contact.civility} ${contact.lastName?.toUpperCase()},<br /> <br />
      Bienvenue sur votre espace professionnel VIZION de VIZEO<br /><br />
      Votre identifiant: ${contact.siteIdentifier}<br />
      Votre nouveau mot de passe: ${contact.password}<br /><br />
      Cliquez sur ce lien <a href="https://vizion.vizeo.eu">vizion.vizeo.eu</a> pour y accéder. <br /><br />
      `}
      onClose={onClose}
      onEmailSent={onClose}
    />
  );
}
