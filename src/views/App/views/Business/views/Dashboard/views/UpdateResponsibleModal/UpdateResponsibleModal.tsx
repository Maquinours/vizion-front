import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import styles from './UpdateResponsibleModal.module.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { updateBusiness } from '../../../../../../../../utils/api/business';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import ReactModal from 'react-modal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/update-responsible');

const yupSchema = yup.object({
  name: yup.string().typeError('').required('Champs requis.'),
  phoneNumber: yup.string().typeError('').nullable(),
  email: yup.string().typeError('').email('Veuillez entrer un email valide').nullable(),
});

export default function AppViewBusinessViewDashboardViewUpdateResponsibleModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old });
  };

  const { mutate } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateBusiness(business.id, {
        profileName: data.name,
        profileEmail: data.email,
        profilePhone: data.phoneNumber,
        title: business.title,
        billingAddressOne: business.billingAddressOne,
        billingZipCode: business.billingZipCode!,
        billingCity: business.billingCity,
        billingCompany: business.billingCompany!,
        billingName: business.billingName,
        deliveryDepartmentCode: business.deliveryDepartmentCode,
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
        representativeId: business.representativeId,
        representativeName: business.representativeName,
        representativeZipCode: business.representativeZipCode,
        zipCode: business.zipCode,
        profileId: business.profileId,
        exportTva: business.exportTva,
        billAndLock: false,
        deliveryMode: business.deliveryMode,
        installerProfileId: business.installerProfileId,
        installerProfileName: business.installerProfileName,
        installerProfileEmail: business.installerProfileEmail,
        type: business.type!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success("Chargé d'affaire modifié avec succès");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification du chargé d'affaire");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>{"Modifier le chargé d'affaire"}</div>
        </div>
        <div className={styles.modal_body}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="name">Nom complet</label>
              <input type="text" {...register('name')} id="name" placeholder="Nom" />
              <p className={styles.__errors}>{errors.name?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="phoneNumber">Téléphone</label>
              <input {...register('phoneNumber')} type="tel" id="phoneNumber" placeholder="Téléphone" />
              <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="email">Mail</label>
              <input type="email" {...register('email')} id="email" placeholder="Mail" />
              <p className={styles.__errors}>{errors.email?.message}</p>
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
