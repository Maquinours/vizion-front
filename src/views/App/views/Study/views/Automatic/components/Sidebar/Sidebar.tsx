import { useMemo, useState } from 'react';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponent from './components/CameraSelectionModal/CameraSelectionModal';
import AppViewStudyViewAutomaticViewSidebarComponentDensityModalComponent from './components/DensityModal/DentityModal';
import AppViewStudyViewAutomaticViewSidebarComponentMonitorSelectionModalComponent from './components/MonitorSelectionModal/MonitorSelectionModal';

enum Modals {
  IndoorCameras,
  OutdoorCameras,
  UniversalCameras,
  Monitor,
}

export default function AppViewStudyViewAutomaticViewSidebarComponent() {
  const [openedModal, setOpenedModal] = useState<Modals>();
  const [densityModalProduct, setDensityModalProduct] = useState<ProductResponseDto>();

  const buttons = useMemo(
    () => [
      {
        label: 'Caméras intérieures',
        image: 'https://bd.vizeo.eu/6-Photos/DA330HD/DA330HD.jpg',
        disabled: false,
        onClick: () => setOpenedModal(Modals.IndoorCameras),
      },
      {
        label: 'Caméras extérieures',
        image: 'https://bd.vizeo.eu/6-Photos/CA60HD/CA60HD.png',
        disabled: false,
        onClick: () => setOpenedModal(Modals.OutdoorCameras),
      },
      {
        label: 'Caméras universelles',
        image: 'https://bd.vizeo.eu/6-Photos/DA350PAP/DA350PAP.png',
        disabled: false,
        onClick: () => setOpenedModal(Modals.UniversalCameras),
      },
      {
        label: 'Moniteurs',
        image: 'https://bd.vizeo.eu/6-Photos/MO122/MO122.png',
        disabled: false,
        onClick: () => setOpenedModal(Modals.Monitor),
      },
      {
        label: 'Enregistreurs',
        image: 'https://bd.vizeo.eu/6-Photos/HD508/Site_BACK_HD508.webp',
        disabled: true,
      },
      {
        label: 'Transmetteurs',
        image: 'https://bd.vizeo.eu/6-Photos/POE08/POE08.webp',
        disabled: true,
      },
    ],
    [setOpenedModal],
  );

  const onCloseModal = () => {
    setOpenedModal(undefined);
  };
  const openDensityModal = (product: ProductResponseDto) => {
    setDensityModalProduct(product);
  };
  const closeDensityModal = () => {
    setDensityModalProduct(undefined);
  };

  const modal = useMemo(() => {
    switch (openedModal) {
      case Modals.IndoorCameras:
        return (
          <AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponent
            type="Caméra interieure"
            onClose={onCloseModal}
            openDensityModal={openDensityModal}
          />
        );
      case Modals.OutdoorCameras:
        return (
          <AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponent
            type="Caméra exterieure"
            onClose={onCloseModal}
            openDensityModal={openDensityModal}
          />
        );
      case Modals.UniversalCameras:
        return (
          <AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponent
            type="Caméra universelle"
            onClose={onCloseModal}
            openDensityModal={openDensityModal}
          />
        );
      case Modals.Monitor:
        return <AppViewStudyViewAutomaticViewSidebarComponentMonitorSelectionModalComponent onClose={onCloseModal} />;
    }
  }, [openedModal, onCloseModal, openDensityModal]);

  return (
    <>
      <div className="space-y-2 border-r-2 border-r-[#1a192b]">
        <h2 className="ml-4 border-b-2 border-b-[#1a192b]">Produits</h2>
        {buttons.map((button) => (
          <button
            key={button.label}
            onClick={button.onClick}
            disabled={button.disabled}
            className="mx-4 grid w-[18rem] grid-cols-3 place-items-center gap-3 rounded-md border border-slate-800 p-2 px-1 shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <img src={button.image} alt={button.label} className="mr-2 w-[70px]" />
            <p className="text-black-700 w-32 text-sm font-bold">{button.label}</p>
          </button>
        ))}
      </div>
      {modal}
      {!!densityModalProduct && (
        <AppViewStudyViewAutomaticViewSidebarComponentDensityModalComponent onClose={closeDensityModal} product={densityModalProduct} />
      )}
    </>
  );
}
