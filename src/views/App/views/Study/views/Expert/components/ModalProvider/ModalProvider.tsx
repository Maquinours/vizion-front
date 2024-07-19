import { useContext } from 'react';
import ExpertStudyContext, { ExpertStudyModalType } from '../../utils/context';
import AppViewStudyViewExpertViewModalProviderComponentAddTextModalComponent from './components/AddTextModal/AddTextModal';
import AppViewStudyViewExpertViewModalProviderComponentCameraModalComponent from './components/CameraModal/CameraModal';
import AppViewStudyViewExpertViewModalProviderComponentEditTextModalComponent from './components/EditTextModal/EditTextModal';
import AppViewStudyViewExpertViewModalProviderComponentMonitorModalComponent from './components/MonitorModal/MonitorModal';
import AppViewStudyViewExpertViewModalProviderComponentOthersCamerasModalComponent from './components/OthersCamerasModal/OthersCamerasModal';
import AppViewStudyViewExpertViewModalProviderComponentRecorderModalComponent from './components/RecorderModal/RecorderModal';
import AppViewStudyViewExpertViewModalProviderComponentTransmittersModalComponent from './components/TransmittersModal/TransmittersModal';
import AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponent from './components/UniversalCameraModal/UniversalCameraModal';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponent from './components/PdfModal/PdfModal';
import AppViewStudyViewExpertViewModalProviderComponentHddCalculationModalComponent from './components/HddCalculationModal/HddCalculationModal';
import AppViewStudyViewExpertViewModalProviderComponentImportGedImageModalComponent from './components/ImportGedImageModal/ImportGedImageModal';
import AppViewStudyViewExpertViewModalProviderComponentServicesModalComponent from './components/ServicesModal/ServicesModal';
import AppViewStudyViewExpertViewModalProviderComponentConfirmQuotationTransferModalComponent from './components/ConfirmQuotationTransferModal/ConfirmQuotationTransferModal';

export default function AppViewStudyViewExpertViewModalProviderComponent() {
  const { modal } = useContext(ExpertStudyContext)!;

  if (modal === undefined) return;
  switch (modal.type) {
    case ExpertStudyModalType.INDOOR_CAMERAS:
      return <AppViewStudyViewExpertViewModalProviderComponentCameraModalComponent category="Caméra interieure" />;
    case ExpertStudyModalType.OUTDOOR_CAMERAS:
      return <AppViewStudyViewExpertViewModalProviderComponentCameraModalComponent category="Caméra exterieure" />;
    case ExpertStudyModalType.DOME_CAMERAS:
      return (
        <>
          <AppViewStudyViewExpertViewModalProviderComponentCameraModalComponent category="Caméra exterieure" />
          <AppViewStudyViewExpertViewModalProviderComponentCameraModalComponent category="Dôme motorisé" />
        </>
      );
    case ExpertStudyModalType.UNIVERSAL_CAMERAS:
      return <AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponent />;
    case ExpertStudyModalType.MONITORS:
      return <AppViewStudyViewExpertViewModalProviderComponentMonitorModalComponent />;
    case ExpertStudyModalType.RECORDERS:
      return <AppViewStudyViewExpertViewModalProviderComponentRecorderModalComponent />;
    case ExpertStudyModalType.TRANSMITTERS:
      return <AppViewStudyViewExpertViewModalProviderComponentTransmittersModalComponent />;
    case ExpertStudyModalType.OTHER_CAMERAS:
      return <AppViewStudyViewExpertViewModalProviderComponentOthersCamerasModalComponent />;
    case ExpertStudyModalType.SERVICES:
      return <AppViewStudyViewExpertViewModalProviderComponentServicesModalComponent />;
    case ExpertStudyModalType.ADD_TEXT:
      return <AppViewStudyViewExpertViewModalProviderComponentAddTextModalComponent nodePosition={modal.data.nodePosition} />;
    case ExpertStudyModalType.EDIT_TEXT:
      return <AppViewStudyViewExpertViewModalProviderComponentEditTextModalComponent nodeId={modal.data.nodeId} />;
    case ExpertStudyModalType.PDF:
      if (modal.data.step === 'IMAGE_GENERATION') return <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponent step={modal.data.step} />;
      else return <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponent step={modal.data.step} images={modal.data.images} />;
    case ExpertStudyModalType.HDD_CALCULATION:
      return <AppViewStudyViewExpertViewModalProviderComponentHddCalculationModalComponent />;
    case ExpertStudyModalType.IMPORT_GED_IMAGE:
      return <AppViewStudyViewExpertViewModalProviderComponentImportGedImageModalComponent type={modal.data.type} />;
    case ExpertStudyModalType.CONFIRM_QUOTATION_TRANSFER:
      return <AppViewStudyViewExpertViewModalProviderComponentConfirmQuotationTransferModalComponent />;
  }
}
