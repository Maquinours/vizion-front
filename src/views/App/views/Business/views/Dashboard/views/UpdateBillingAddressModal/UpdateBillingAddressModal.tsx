import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateBusiness } from '../../../../../../../../utils/api/business';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateBillingAddressModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/update-billing-address');

const yupSchema = yup.object({
  billingCompany: yup.string().required('Champs requis.'),
  billingName: yup.string().typeError('Format invalide').nullable(),
  billingAddressOne: yup.string().required('Champs est requis.'),
  billingAddressTwo: yup.string().nullable(),
  billingZipCode: yup
    .string()
    .required('Le code postal est requis')
    .matches(/([A-Z0-9]{5})$/, {
      message: 'Format invalide (doit contenir 05 caracteres (95012 / 2A256)',
      excludeEmptyString: true,
    }),
  billingCity: yup.string().required('Champs est requis.'),
  billingPhoneNumber: yup.string().nullable(),
  billingEmail: yup.string().email('Veuillez entrer un email valide').nullable(),
});

export default function AppViewBusinessViewDashboardViewUpdateBillingAddressModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      billingCompany: business.billingCompany ?? undefined,
      billingName: business.billingName,
      billingAddressOne: business.billingAddressOne ?? undefined,
      billingAddressTwo: business.billingAddressTwo,
      billingZipCode: business.billingZipCode ?? undefined,
      billingCity: business.billingCity ?? undefined,
      billingPhoneNumber: business.billingPhoneNumber,
      billingEmail: business.billingEmail,
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateBusiness(business.id, {
        title: business.title,
        billingAddressOne: data.billingAddressOne,
        billingAddressTwo: data.billingAddressTwo,
        billingZipCode: data.billingZipCode,
        billingCity: data.billingCity,
        billingCompany: data.billingCompany,
        billingName: data.billingName,
        billingPhoneNumber: data.billingPhoneNumber,
        billingEmail: data.billingEmail,
        billingDepartmentCode: data.billingZipCode?.toString().trim().slice(0, 2),
        deliveryDepartmentCode: business.deliverAddressZipCode,
        deliverAddressOne: business.deliverAddressOne,
        deliverAddressTwo: business.deliverAddressTwo,
        deliverAddressZipCode: business.deliverAddressZipCode,
        deliverAddressCity: business.deliverAddressCity,
        deliverPhoneNumber: business.deliverPhoneNumber,
        deliverAddressCompany: business.deliverAddressCompany,
        deliverAddressName: business.deliverAddressName,
        deliverEmail: business.deliverEmail,
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        enterpriseCategory: business.enterpriseCategory,
        reduction: business.reduction ?? 0,
        representativeId: business?.representativeId,
        representativeName: business?.representativeName,
        representativeZipCode: business?.representativeZipCode,
        zipCode: business.zipCode,
        profileId: business.profileId,
        profileName: business.profileName,
        profileEmail: business.profileEmail,
        profilePhone: business.profilePhone,
        exportTva: false,
        billAndLock: false,
        deliveryMode: business.deliveryMode,
        installerProfileId: business.installerProfileId,
        installerProfileName: business.installerProfileName,
        installerProfileEmail: business.installerProfileEmail,
        type: business.type!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success('Adresse de facturation modifiée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de l'adresse de facturation");
    },
  });

  return (
    <ReactModal isOpen={true} overlayClassName="Overlay" onRequestClose={onClose} className={styles.modal}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>{"Modifier l'adresse de facturation"}</div>
        </div>

        <div className={styles.modal_body}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="billingCompany">Société</label>
              <input type="text" {...register('billingCompany')} id="billingCompany" placeholder="Nom de la société" />
              <p className={styles.__errors}>{errors.billingCompany?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingName">Nom complet</label>
              <input type="text" {...register('billingName')} id="billingName" placeholder="Nom" />
              <p className={styles.__errors}>{errors.billingName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingAddressOne">Adresse 1</label>
              <textarea rows={4} {...register('billingAddressOne')} id="billingAddressOne" placeholder="Adresse 1" />
              <p className={styles.__errors}>{errors.billingAddressOne?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingAddressTwo">Adresse 2</label>
              <textarea rows={4} {...register('billingAddressTwo')} id="billingAddressTwo" placeholder="Adresse 2" />
              <p className={styles.__errors}>{errors.billingAddressTwo?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingZipCode">Code Postal</label>
              <input {...register('billingZipCode')} id="billingZipCode" placeholder="Code Postal" />
              <p className={styles.__errors}>{errors.billingZipCode?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingCity">Ville</label>
              <input type="text" {...register('billingCity')} id="billingCity" placeholder="Ville" />
              <p className={styles.__errors}>{errors.billingCity?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingPhoneNumber">Téléphone</label>
              <input {...register('billingPhoneNumber')} type="tel" id="billingPhoneNumber" placeholder="Téléphone" />
              <p className={styles.__errors}>{errors.billingPhoneNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingEmail">Mail</label>
              <input type="email" {...register('billingEmail')} id="billingEmail" placeholder="Mail" />
              <p className={styles.__errors}>{errors.billingEmail?.message}</p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '1rem 0',
              }}
            >
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.footer_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-secondary" type="submit">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
