import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import ReactModal from 'react-modal';
import ProfileRequestDto from '../../../../../../utils/types/ProfileRequestDto';
import styles from './ImportContactsModal.module.scss';
import AppViewEnterpriseViewImportContactsModalViewStepOneComponent from './components/StepOne/StepOne';
import AppViewEnterpriseViewImportContactsModalViewStepTwoComponent from './components/StepTwo/StepTwo';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/import-contacts');

export default function AppViewEnterpriseViewImportContactsModalView() {
  const navigate = routeApi.useNavigate();

  const [step, setStep] = useState<0 | 1>(0);
  const [file, setFile] = useState<File>();
  const [profiles, setProfiles] = useState<Array<ProfileRequestDto>>([]);

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      {step === 0 ? (
        <AppViewEnterpriseViewImportContactsModalViewStepOneComponent file={file} setFile={setFile} setProfiles={setProfiles} setStep={setStep} />
      ) : (
        step === 1 && <AppViewEnterpriseViewImportContactsModalViewStepTwoComponent profiles={profiles} setStep={setStep} />
      )}
    </ReactModal>
  );
}
