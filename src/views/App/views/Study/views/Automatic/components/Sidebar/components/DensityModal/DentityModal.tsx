import ReactModal from 'react-modal';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';

type AppViewStudyViewAutomaticViewSidebarComponentDensityModalComponentProps = Readonly<{
  onClose: () => void;
  product: ProductResponseDto;
}>;
export default function AppViewStudyViewAutomaticViewSidebarComponentDensityModalComponent({
  onClose,
  product,
}: AppViewStudyViewAutomaticViewSidebarComponentDensityModalComponentProps) {
  return (
    <ReactModal
      isOpen
      overlayClassName="Overlay"
      onRequestClose={onClose}
      className="absolute top-2/4 left-2/4 m-auto h-auto w-auto max-w-[1000px] min-w-[40%] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
    >
      <div className="relative mx-auto mt-2 flex h-fit w-[1000px] flex-col space-y-4 rounded-md border-2 border-t-0 border-[#31385a] bg-slate-50 px-7 py-0 pb-4 text-[#31385a]">
        <div className="absolute inset-x-0 mt-0 flex h-12 border-collapse items-center justify-center rounded-t-md border-t border-t-[#31385a] bg-[#31385a] text-center text-white">
          Densité
        </div>
        <div className="h-6" />

        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <img
                  src={`https://bd.vizeo.eu/6-Photos/${product.reference}/DENSITE_MAX_${product.reference}.jpg`}
                  alt="Caméra"
                  className="h-96 w-fit object-center"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 text-white">
          <button className="btn btn-secondary mt-5 rounded-md" onClick={() => onClose()}>
            Fermer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
