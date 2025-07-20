import { useState } from 'react';
import ReactModal from 'react-modal';
import ProfileRequestDto from '../../../../utils/types/ProfileRequestDto';
import EnterpriseModalComponentImportContactsModalComponentStepOneComponent from './components/StepOne/StepOne';
import EnterpriseModalComponentImportContactsModalComponentStepTwoComponent from './components/StepTwo/StepTwo';
import styles from './ImportContactsModal.module.scss';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/import-contacts');

type EnterpriseModalComponentImportContactsModalComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onClose: () => void;
}>;
export default function EnterpriseModalComponentImportContactsModalComponent({
  enterprise,
  onClose,
}: EnterpriseModalComponentImportContactsModalComponentProps) {
  // const navigate = routeApi.useNavigate();

  const [step, setStep] = useState<0 | 1>(0);
  const [file, setFile] = useState<File>();
  const [profiles, setProfiles] = useState<Array<ProfileRequestDto>>([]);

  // const onClose = () => {
  //   navigate({ to: '..', search: true, replace: true, resetScroll: false });
  // };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      {step === 0 ? (
        <EnterpriseModalComponentImportContactsModalComponentStepOneComponent
          enterprise={enterprise}
          file={file}
          setFile={setFile}
          setProfiles={setProfiles}
          setStep={setStep}
          onClose={onClose}
        />
      ) : (
        step === 1 && <EnterpriseModalComponentImportContactsModalComponentStepTwoComponent profiles={profiles} setStep={setStep} onClose={onClose} />
      )}
    </ReactModal>
  );
}
