import styles from './Buttons.module.scss';

export default function SendEmailComponentHeaderComponentButtonsComponent() {
  return (
    <div className={styles.button_container}>
      <button
        className="btn btn-primary-light"
        onClick={(e) => {
          e.preventDefault();
          // saveToStore(); // TODO: implement saveToStore
        }}
      >
        Sauvegarder
      </button>
      <button className="btn btn-primary" type="reset">
        RAZ
      </button>
      <button className="btn btn-secondary" type="submit">
        Envoyer
      </button>
    </div>
  );
}
