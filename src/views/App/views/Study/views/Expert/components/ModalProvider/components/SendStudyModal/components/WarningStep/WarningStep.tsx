import ReactModal from 'react-modal';

type AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentWarningStepComponentProps = Readonly<{
  onConfirm: () => void;
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentWarningStepComponent({
  onConfirm,
  onClose,
}: AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentWarningStepComponentProps) {
  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute top-2/4 left-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
    >
      <div className="w-full rounded-md bg-white pb-2">
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-(--primary-color) text-white">Attention</h2>
        <div className="flex flex-col gap-y-4 p-4">
          <p className="text-center text-(--primary-color)">
            Des produits importés ne seront pas valorisés dans le chiffrage.
            <br />
            Voulez-vous continuer ?
          </p>

          <div className="flex items-center justify-center space-x-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="button" onClick={onConfirm} className="btn btn-primary">
              Continuer
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
