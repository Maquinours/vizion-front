import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import AppViewRmaViewDeliveryViewTravelVoucherModalViewFormModalComponent from './components/FormModal/FormModal';
import AppViewRmaViewDeliveryViewTravelVoucherModalViewShowModalComponent from './components/ShowModal/ShowModal';

enum Step {
  FORM,
  SHOW,
}

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery/travel-voucher');

export default function AppViewRmaViewDeliveryViewTravelVoucherModalView() {
  const navigate = routeApi.useNavigate();

  const [step, setStep] = useState<Step>(Step.FORM);
  const [data, setData] = useState<Array<File>>();

  const { rma } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const onGenerated = (data: Array<File>) => {
    setData(data);
    setStep(Step.SHOW);
  };

  return (
    <>
      <AppViewRmaViewDeliveryViewTravelVoucherModalViewFormModalComponent rma={rma} show={step === Step.FORM} onClose={onClose} onGenerated={onGenerated} />
      <AppViewRmaViewDeliveryViewTravelVoucherModalViewShowModalComponent show={step === Step.SHOW} onClose={() => setStep(Step.FORM)} data={data} />
    </>
  );
}
