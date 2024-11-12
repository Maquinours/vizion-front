import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEnterprise } from '../../../../../../../../utils/api/enterprise';
import AppViewToolsViewMenuViewCreateEnterpriseModalViewStepOneComponent, { CreateEnterpriseStepOneDataType } from './components/StepOne/StepOne';
import { useMemo, useState } from 'react';
import { formatPhoneNumber } from 'react-phone-number-input';
import ProfileAgencyRequestDto from '../../../../../../../../utils/types/ProfileAgencyRequestDto';
import AppViewToolsViewMenuViewCreateEnterpriseModalViewStepTwoComponent, { CreateEnterpriseStepTwoDataType } from './components/StepTwo/StepTwo';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { CreateEnterpriseContext } from './utils/contexts/context';
import ReactModal from 'react-modal';
import styles from './CreateEnterpriseModal.module.scss';
import { E164Number } from 'libphonenumber-js';

export default function AppViewToolsViewMenuViewCreateEnterpriseModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [step, setStep] = useState<0 | 1>(0);
  const [stepOneData, setStepOneData] = useState<CreateEnterpriseStepOneDataType>();
  const [contacts, setContacts] = useState<Array<Omit<ProfileAgencyRequestDto, 'categoryClient'>>>([]);

  const contextValue = useMemo(
    () => ({
      contacts,
      setContacts,
    }),
    [contacts, setContacts],
  );

  const onSubmitStepOne = (data: CreateEnterpriseStepOneDataType) => {
    setStepOneData(data);
    setStep(1);
  };

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateEnterpriseStepTwoDataType) => {
      const departments = await queryClient.ensureQueryData(queries.departments.list);
      const department = departments.find((item) => [stepOneData!.zipCode.slice(0, 2), stepOneData!.zipCode.slice(0, 3)].includes(item.code));

      return createEnterprise({
        name: stepOneData!.name,
        sign: stepOneData!.sign,
        category: stepOneData!.category,
        addressLineOne: stepOneData!.addressLineOne,
        addressLineTwo: stepOneData!.addressLineTwo,
        zipCode: stepOneData!.zipCode,
        city: stepOneData!.city,
        department: department?.name,
        departmentCode: department?.code,
        country: stepOneData!.country,
        email: stepOneData!.email === '' ? null : stepOneData!.email,
        phoneNumber: stepOneData!.phoneNumber ? formatPhoneNumber(stepOneData!.phoneNumber as E164Number) : null,
        infoSup: {
          representativeId: data.representative,
          enterpriseRelationShips: data.relations.map((relation) => ({ fullName: relation ?? '' })).filter((relation) => !!relation.fullName),
          webSite: data.webSite,
        },
        accountability: {
          billingServiceName: data.billingServiceName,
          tvaNumber: data.tvaNumber,
          siren: data.siren ?? '',
          discount: data.discount,
          accountingEmail: data.accountingEmail,
          accountNumber: data.accountNumber,
        },
        headId: null,
        profileListDto: {
          enterpriseId: null,
          profileAgencyDtoList: contacts.map((contact) => ({ ...contact, categoryClient: stepOneData!.category })),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.enterprise._def });
      toast.success('Entreprise créée avec succès');
      navigate({ to: '/app/enterprises' });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'entreprise");
    },
  });

  return (
    <CreateEnterpriseContext.Provider value={contextValue}>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <AppViewToolsViewMenuViewCreateEnterpriseModalViewStepOneComponent show={step === 0} onSubmit={onSubmitStepOne} />
          <AppViewToolsViewMenuViewCreateEnterpriseModalViewStepTwoComponent
            stepOneData={stepOneData}
            show={step === 1}
            goToPreviousStep={() => setStep(0)}
            onSubmit={(data) => mutate(data)}
            isPending={isPending}
          />
        </div>
      </ReactModal>
      <Outlet />
    </CreateEnterpriseContext.Provider>
  );
}
