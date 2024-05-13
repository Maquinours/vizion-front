import { useState } from 'react';
import AppViewToolsViewMailsViewCreateModalViewFormModalComponent, { CreateMailFormType } from './components/FormModal/FormModal';
import AppViewToolsViewMailsViewCreateModalViewShowModalComponent from './components/ShowModal/ShowModal';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMail } from '../../../../../../../../utils/api/mails';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { mailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/mails';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/tools/mails/create');

export default function AppViewToolsViewMailsViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { data: user } = useAuthentifiedUserQuery();

  const [step, setStep] = useState<0 | 1>(0);
  const [mailData, setMailData] = useState<CreateMailFormType>();

  const onFormSubmit = (data: CreateMailFormType) => {
    setMailData(data);
    setStep(1);
  };

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createMail({
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
      <AppViewToolsViewMailsViewCreateModalViewFormModalComponent show={step === 0} onClose={onClose} onSubmit={onFormSubmit} />
      <AppViewToolsViewMailsViewCreateModalViewShowModalComponent
        show={step === 1}
        mail={mailData}
        onClose={() => setStep(0)}
        onSubmit={() => mutate()}
        isPending={isPending}
      />
    </>
  );
}
