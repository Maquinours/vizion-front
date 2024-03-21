import styles from './StepTwo.module.scss';

type UpdateContactPasswordModalComponentStepTwoComponentProps = Readonly<{
  onConfirm: () => void;
  onClose: () => void;
}>;
export default function UpdateContactPasswordModalComponentStepTwoComponent({ onConfirm, onClose }: UpdateContactPasswordModalComponentStepTwoComponentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>Envoi du mot de passe</p>
      </div>

      <div className={styles.content}>
        <p>Voulez-vous envoyer le mot de passe mail par mail ?</p>
      </div>

      <div className={styles.footer}>
        <button onClick={onClose} className="btn btn-primary">
          Annuler
        </button>
        <button className="btn btn-secondary" onClick={onConfirm}>
          Confirmer
        </button>
      </div>
    </div>
  );
}
