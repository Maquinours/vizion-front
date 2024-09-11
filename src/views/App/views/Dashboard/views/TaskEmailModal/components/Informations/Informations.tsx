import { AiOutlineCopy } from 'react-icons/ai';
import { toast } from 'react-toastify';
import MailResponseDto from '../../../../../../../../utils/types/MailResponseDto';
import { formatDateWithHour } from '../../../../../../../../utils/functions/dates';
import styles from './Informations.module.scss';

type AppViewDashboardViewTaskEmailModalViewInformationsComponentProps = Readonly<{
  email: MailResponseDto;
}>;
export default function AppViewDashboardViewTaskEmailModalViewInformationsComponent({
  email,
}: AppViewDashboardViewTaskEmailModalViewInformationsComponentProps) {
  const copyEmailAddress = (email: string) => {
    navigator.clipboard
      .writeText(email)
      .then(() => toast.success('Adresse email copiée dans le presse-papiers'))
      .catch((error) => {
        console.error(error);
        toast.error("Une erreur est survenue lors de la copie de l'adresse email");
      });
  };

  return (
    <>
      <div className={styles.subject}>
        <strong>Objet du mail :</strong> {email.subject}
      </div>
      <div className={styles.informations}>
        <div>
          <p className={styles.sender}>
            De : {email.sender}
            <button onClick={() => copyEmailAddress(email.sender)}>
              <AiOutlineCopy />
            </button>
          </p>
          <p className={styles.receiver}>À : {email.receiver?.split(';').join(' ')}</p>
          <p>
            CC :{' '}
            {!!email.cc &&
              email.cc.split(';').map((cc, index, arr) => (
                <>
                  <span>{cc}</span>
                  <button onClick={() => copyEmailAddress(cc)}>
                    <AiOutlineCopy />
                  </button>
                  {index !== arr.length - 1 ? ' ' : ''}
                </>
              ))}
          </p>
        </div>

        <div className={styles.receiveDate}>Envoyé le : {formatDateWithHour(email.sendDate)}</div>
      </div>
    </>
  );
}
