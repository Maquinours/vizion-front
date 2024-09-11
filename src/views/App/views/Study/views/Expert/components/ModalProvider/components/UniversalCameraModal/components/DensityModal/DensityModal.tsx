import ReactModal from 'react-modal';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';

type AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponentDensityModalComponentProps = Readonly<{
  product: ProductResponseDto;
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponentDensityModalComponent({
  product,
  onClose,
}: AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponentDensityModalComponentProps) {
  return (
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-auto max-w-lg -translate-x-2/4 -translate-y-2/4 rounded-md bg-white p-4 opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <img src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.png`} alt={`Camera ${product.reference}`} className="w-full" />
      <div className="mt-5 flex items-center justify-center sm:mt-6">
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Fermer
        </button>
      </div>
    </ReactModal>
  );
}
