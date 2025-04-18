import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { E164Number } from 'libphonenumber-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { formatPhoneNumber } from 'react-phone-number-input';
import { toast } from 'react-toastify';
import { createEnterprise } from '../../utils/api/enterprise';
import { queries } from '../../utils/constants/queryKeys';
import ProfileAgencyRequestDto from '../../utils/types/ProfileAgencyRequestDto';
import CreateEnterpriseModalComponentAddContactModalComponent from './components/AddContactModal/AddContactModal';
import CreateEnterpriseModalComponentContactsModalComponent from './components/ContactsModal/ContactsModal';
import CreateEnterpriseModalComponentStepOneComponent, { CreateEnterpriseStepOneDataType } from './components/StepOne/StepOne';
import CreateEnterpriseModalComponentStepTwoComponent, { CreateEnterpriseStepTwoDataType } from './components/StepTwo/StepTwo';
import styles from './CreateEnterpriseModal.module.scss';
import { CreateEnterpriseContext } from './utils/contexts/context';
import { isAxiosError } from 'axios';

type ModalIds = 'add-contact' | 'contacts';

interface CreateEnterpriseModalComponentProps {
  onClose: () => void;
  defaultContactPhoneNumber?: string;
}
export default function CreateEnterpriseModalComponent({ onClose, defaultContactPhoneNumber }: CreateEnterpriseModalComponentProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [step, setStep] = useState<0 | 1>(0);
  const [stepOneData, setStepOneData] = useState<CreateEnterpriseStepOneDataType>();
  const [contacts, setContacts] = useState<Array<Omit<ProfileAgencyRequestDto, 'categoryClient'>>>([]);
  const [modalId, setModalId] = useState<ModalIds | null>('add-contact');
  const [useDefaultContactPhoneNumber, setUseDefaultContactPhoneNumber] = useState<boolean>(true);

  const onSubmitStepOne = (data: CreateEnterpriseStepOneDataType) => {
    setStepOneData(data);
    setStep(1);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateEnterpriseStepTwoDataType) => {
      const department = await (async () => {
        const zipCode = stepOneData!.zipCode;
        if (!zipCode) return undefined;
        const departments = await queryClient.ensureQueryData(queries.departments.list);
        return departments.find((item) => [zipCode.slice(0, 2), zipCode.slice(0, 3)].includes(item.code));
      })();

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
      if (isAxiosError(error) && error.response?.data?.message === "Ce nom d'entreprise est déjà utilisé.") toast.error(error.response?.data?.message);
      else {
        console.error(error);
        toast.error("Une erreur est survenue lors de la création de l'entreprise");
      }
    },
  });

  const openModal = useCallback((modalId: ModalIds) => setModalId(modalId), [setModalId]);
  const closeModal = useCallback(() => setModalId(null), [setModalId]);

  const contextValue = useMemo(
    () => ({
      contacts,
      setContacts,
      openModal,
      closeModal,
    }),
    [contacts, setContacts, openModal, closeModal],
  );

  const modal = (() => {
    switch (modalId) {
      case 'add-contact': {
        const defaultPhoneNumber = useDefaultContactPhoneNumber ? defaultContactPhoneNumber : undefined;
        return <CreateEnterpriseModalComponentAddContactModalComponent defaultPhoneNumber={defaultPhoneNumber} />;
      }
      case 'contacts':
        return <CreateEnterpriseModalComponentContactsModalComponent />;
    }
  })();

  useEffect(() => {
    if (modalId !== 'add-contact') setUseDefaultContactPhoneNumber(false);
  }, [modalId]);

  return (
    <CreateEnterpriseContext.Provider value={contextValue}>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <CreateEnterpriseModalComponentStepOneComponent show={step === 0} onSubmit={onSubmitStepOne} />
          <CreateEnterpriseModalComponentStepTwoComponent
            stepOneData={stepOneData}
            show={step === 1}
            goToPreviousStep={() => setStep(0)}
            onSubmit={(data) => mutate(data)}
            isPending={isPending}
          />
        </div>
      </ReactModal>
      {modal}
    </CreateEnterpriseContext.Provider>
  );
}
