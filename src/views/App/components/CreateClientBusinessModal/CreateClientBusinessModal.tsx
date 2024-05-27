import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { yupResolver } from '@hookform/resolvers/yup';
import { createBusiness } from '../../../../utils/api/business';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import BusinessType from '../../../../utils/enums/BusinessType';
import { toast } from 'react-toastify';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import { PulseLoader } from 'react-spinners';
import styles from './CreateClientBusinessModal.module.scss';
import CustomSelect from '../../../../components/CustomSelect/CustomSelect';

const Route = getRouteApi('/app');

const yupSchema = yup.object().shape({
  contact: yup.mixed<ProfileResponseDto>().required("L'utilisateur est requis"),
});

export default function AppViewCreateClientBusinessModalComponent() {
  const navigate = useNavigate();

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
    navigate({ from: Route.id, search: (search) => ({ ...search, appModal: undefined }), replace: true, resetScroll: false });
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
    onSuccess: () => {
      toast.success('Affaire créée avec succès');
      // TODO: set data & redirect to synoptic
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
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={enterprise.profiles}
                    getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Sélectionnez un contact"
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="contact"
                control={control}
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
