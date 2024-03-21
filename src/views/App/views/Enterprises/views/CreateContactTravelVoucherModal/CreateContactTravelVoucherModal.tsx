import { getRouteApi, useNavigate } from '@tanstack/react-router';
import AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponent from './components/StepOne/StepOne';
import { useState } from 'react';
import AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponent from './components/StepTwo/StepTwo';

const routeApi = getRouteApi('/app/enterprises/create-contact-travel-voucher/$contactId');

export default function AppViewEnterprisesViewCreateContactTravelVoucherModalView() {
  const navigate = useNavigate();

  const [files, setFiles] = useState<Array<File>>();

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };
  return (
    <>
      <AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponent isOpen={!files} setFiles={setFiles} onClose={onClose} />
      <AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponent isOpen={!!files} files={files} onClose={onClose} />
    </>
  );
}
