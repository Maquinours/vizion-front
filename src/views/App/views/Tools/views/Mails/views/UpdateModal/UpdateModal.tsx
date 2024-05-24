import { getRouteApi, useNavigate } from '@tanstack/react-router';
import AppViewToolsViewMailsViewUpdateModalViewFormModalComponent, { UpdateMailFormType } from './components/FormModal/FormModal';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import AppViewToolsViewMailsViewUpdateModalViewShowModalComponent from './components/ShowModal/ShowModal';
import { updateMail } from '../../../../../../../../utils/api/mails';
import { mailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/mails';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/tools/mails/update/$mailId');

export default function AppViewToolsViewMailsViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { data: user } = useAuthentifiedUserQuery();

  const { mail } = routeApi.useLoaderData();

  const [step, setStep] = useState<0 | 1>(0);
  const [mailData, setMailData] = useState<UpdateMailFormType>();

  const onFormSubmit = (data: UpdateMailFormType) => {
    setMailData(data);
    setStep(1);
  };

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateMail(mail.id, {
        subject: mailData!.object,
        content: mailData!.sections.reduce((acc: Record<string, string>, section, index) => {
          acc[`section${index}`] = section.content;
          return acc;
        }, {}),
        enterpriseName: mailData!.enterprise.name,
        enterpriseCategory: mailData!.enterprise.category,
        addressLineOne: mailData!.addressOne,
        addressLineTwo: mailData!.addressTwo,
        zipCode: mailData!.zipCode,
        city: mailData!.city,
        department: mailData!.enterprise.department,
        profileName: `${mailData!.contact.firstName} ${mailData!.contact.lastName}`,
        profileEmail: mailData!.contact.email,
        email: mailData!.enterprise.email,
        profilePhone: mailData!.contact.phoneNumber,
        profileSenderName: `${user.profile.lastName} ${user.profile.firstName}`,
        profileSenderEmail: user.profile.email,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailQueryKeys._def });
      toast.success('Mail envoyé avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'envoi du mail.");
    },
  });

  return (
    <>
      <AppViewToolsViewMailsViewUpdateModalViewFormModalComponent show={step === 0} onClose={onClose} onSubmit={onFormSubmit} mail={mail} />
      <AppViewToolsViewMailsViewUpdateModalViewShowModalComponent
        show={step === 1}
        mail={mail}
        data={mailData}
        onClose={() => setStep(0)}
        onSubmit={() => mutate()}
        isPending={isPending}
      />
    </>
  );
}
