import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { InferType, object, string } from 'yup';
import { createBusiness } from '../../../../utils/api/business';
import { businesses } from '../../../../utils/constants/queryKeys/business';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import BusinessType from '../../../../utils/enums/BusinessType';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import styles from './CreateBusinessModal.module.scss';

const yupSchema = object({
  title: string().required("Le nom de l'affaire est requis"),
});

export default function AppViewCreateBusinessModalComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(currentUser.profile.enterprise!.id));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ search: (prev) => ({ ...prev, appModal: undefined }), replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title }: InferType<typeof yupSchema>) =>
      createBusiness({
        title,
        billingAddressOne: enterprise.addressLineOne,
        billingAddressTwo: '',
        billingZipCode: enterprise.zipCode,
        billingCity: enterprise.city,
        billingCompany: enterprise.name,
        billingName: `${currentUser.profile.firstName ?? ''} ${currentUser.profile.lastName ?? ''}`,
        reduction: enterprise.accountability?.discount ? enterprise?.accountability?.discount : 0,
        deliverAddressOne: null,
        deliverAddressTwo: null,
        deliverAddressZipCode: null,
        deliverAddressCity: currentUser.profile?.landlinePhoneNumber,
        deliverAddressCompany: enterprise.name,
        deliverAddressName: `${currentUser.profile.firstName ?? ''} ${currentUser.profile.lastName ?? ''}`,
        deliverPhoneNumber: null,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
        enterpriseCategory: enterprise.category,
        representativeId: null,
        installerProfileId: enterprise.category === CategoryClient.INSTALLATEUR ? currentUser.profile.id : null,
        installerProfileName: enterprise.category === CategoryClient.INSTALLATEUR ? enterprise.name : null,
        installerProfileEmail: enterprise.category === CategoryClient.INSTALLATEUR ? currentUser.profile.email : null,
        representativeName: null,
        representativeZipCode: null,
        zipCode: null,
        type: enterprise.category === CategoryClient.FOURNISSEUR ? BusinessType.CONTACT_FOURNISSEUR : BusinessType.CONTACT,
        profileId: currentUser.profile.id,
        profileName: `${currentUser.profile.firstName ?? ''} ${currentUser.profile.lastName ?? ''}`,
        profileEmail: currentUser.profile.email,
        profilePhone: currentUser.profile.phoneNumber,
        deliveryDepartmentCode: null,
        exportTva: true,
        deliveryMode: 'A expédier',
        billAndLock: false,
      }),
    onSuccess: (business) => {
      toast.success(`Affaire créée avec succès.`);
      queryClient.setQueryData(businesses.detail._ctx.byId(business.id).queryKey, business);
      navigate({ search: (old) => ({ ...old, appModal: 'business-ged', businessId: business.id }), replace: true, resetScroll: false });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'affaire");
    },
  });

  return (
    <ReactModal isOpen={true} overlayClassName="Overlay" className={styles.modal} onRequestClose={onClose}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h6>Nouvelle affaire</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form__group}>
              <label htmlFor="businessName">{"Nom de l'affaire"}</label>
              <input id="businessName" {...register('title')} />
              <p>{errors.title?.message}</p>
            </div>

            <div className={styles.loader_container}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.form__buttons}>
              <button className="btn btn-primary-light" type="reset">
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
