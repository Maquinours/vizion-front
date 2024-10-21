import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../components/CustomSelect/CustomSelect';
import { createBusiness } from '../../../../utils/api/business';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import BusinessType from '../../../../utils/enums/BusinessType';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import styles from './CreateClientBusinessModal.module.scss';
import { useContext } from 'react';
import { TabsContext } from '../TabsContainer/utils/contexts/context';

const yupSchema = yup.object().shape({
  contact: yup.mixed<ProfileResponseDto>().required("L'utilisateur est requis"),
});

export default function AppViewCreateClientBusinessModalComponent() {
  const navigate = useNavigate();

  const { getCurrentTab, updateTabRoute } = useContext(TabsContext)!;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: currentUser } = useAuthentifiedUserQuery();

  const enterpriseId = currentUser.profile.enterprise!.id;

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const onClose = () => {
    navigate({ to: '.', search: (prev) => ({ ...prev, appModal: undefined }), replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ contact }: yup.InferType<typeof yupSchema>) =>
      createBusiness({
        title: null,
        billingAddressOne: enterprise.addressLineOne,
        billingZipCode: enterprise.zipCode,
        billingCity: enterprise.city,
        billingCompany: enterprise.name,
        billingName: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
        reduction: enterprise.accountability?.discount ?? 0,
        deliverAddressOne: null,
        deliverAddressTwo: null,
        deliverAddressZipCode: null,
        deliverAddressCity: contact.landlinePhoneNumber,
        deliverAddressCompany: enterprise.name,
        deliverAddressName: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
        deliverPhoneNumber: null,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
        enterpriseCategory: enterprise.category,
        representativeId: null,
        installerProfileId: enterprise.category === CategoryClient.INSTALLATEUR ? contact.id : null,
        installerProfileName: enterprise.category === CategoryClient.INSTALLATEUR ? enterprise.name : null,
        installerProfileEmail: enterprise.category === CategoryClient.INSTALLATEUR ? contact.email : null,
        representativeName: null,
        representativeZipCode: null,
        zipCode: null,
        type: enterprise.category === CategoryClient.FOURNISSEUR ? BusinessType.CONTACT_FOURNISSEUR : BusinessType.CONTACT,
        profileId: contact.id,
        profileName: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
        profileEmail: contact.email,
        profilePhone: contact.phoneNumber,
        deliveryDepartmentCode: null,
        exportTva: true,
        deliveryMode: 'A expédier',
        billAndLock: false,
      }),
    onSuccess: async (business) => {
      toast.success('Affaire créée avec succès');
      const currentTabId = getCurrentTab()?.id;
      await navigate({ to: '/app/businesses-rma/business/$businessId/study', params: { businessId: business.id } });
      if (!!currentTabId)
        updateTabRoute(currentTabId, (tab) => ({
          search: typeof tab.route.search === 'object' ? { ...tab.route.search, appModal: undefined } : tab.route.search,
        }));
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'affaire");
    },
  });

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
      className={styles.modal}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h6>Nouvelle affaire</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_custom_group}>
              <label htmlFor="Contact">Contact</label>
              <Controller
                name="contact"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={enterprise.profiles}
                    getOptionLabel={(opt) => `${opt.firstName ?? ''} ${opt.lastName ?? ''}`.trim()}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Sélectionnez un contact"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <p>{errors.contact?.message}</p>
            </div>

            <div className={styles.loader_container}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.form__buttons}>
              <button className="btn btn-primary-light" type="reset">
                Annuler
              </button>
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
