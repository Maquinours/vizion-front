import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import ReactModal from 'react-modal';
import AddressRequestDto from '../../../../../../../../utils/types/AddressRequestDto';
import styles from './ImportModal.module.scss';
import AppViewEnterpriseViewAddressBookModalViewImportModalViewStepOneComponent from './components/StepOne/StepOne';
import AppViewEnterpriseViewAddressBookModalViewImportModalViewStepTwoComponent from './components/StepTwo/StepTwo';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/address-book/import');

enum Step {
  One,
  Two,
}

export default function AppViewEnterpriseViewAddressBookModalViewImportModalView() {
  const navigate = routeApi.useNavigate();

  const [step, setStep] = useState<Step>(Step.One);
  const [file, setFile] = useState<File>();
  const [addresses, setAddresses] = useState<Array<AddressRequestDto>>();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const onStepOneSubmit = (file: File, addresses: Array<AddressRequestDto>) => {
    setFile(file);
    setAddresses(addresses);
    setStep(Step.Two);
  };

  const children = (() => {
    switch (step) {
      case Step.One:
        return <AppViewEnterpriseViewAddressBookModalViewImportModalViewStepOneComponent onSubmit={onStepOneSubmit} onClose={onClose} file={file} />;
      case Step.Two:
        return (
          <AppViewEnterpriseViewAddressBookModalViewImportModalViewStepTwoComponent
            addresses={addresses!}
            onPrevious={() => setStep(Step.One)}
            onClose={onClose}
          />
        );
      default:
        return <div>Hello /app/enterprises/$enterpriseId/address-book/import/import!</div>;
    }
  })();

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      {children}
    </ReactModal>
  );
}
