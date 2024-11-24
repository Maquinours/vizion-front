import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponent from './components/StepOne/StepOne';
import AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponent from './components/StepTwo/StepTwo';

const routeApi = getRouteApi('/app/enterprises/create-contact-travel-voucher/$contactId');

export default function AppViewEnterprisesViewCreateContactTravelVoucherModalView() {
  const navigate = routeApi.useNavigate();

  const [files, setFiles] = useState<Array<File>>();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };
  return (
    <>
      <AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponent isOpen={!files} setFiles={setFiles} onClose={onClose} />
      <AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponent isOpen={!!files} files={files} onClose={onClose} />
    </>
  );
}
