import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateAddress } from '../../../../../../../../../../utils/api/address';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/address-book/update/$addressId');

const yupSchema = yup.object({
  receiverCompanyName: yup.string().required('Champs requis.'),
  receiverName: yup.string().typeError('Format invalide').nullable(),
  receiverAddressOne: yup.string().required('Champs est requis.'),
  receiverAddressTwo: yup.string().nullable(),
  receiverZipCode: yup
    .string()
    .required('Le code postal est requis')
    .matches(/([A-Z0-9]{5})$/, {
      message: 'Format invalide (doit contenir 05 caracteres (95012 / 2A256)',
      excludeEmptyString: true,
    }),
  receiverCity: yup.string().required('Champs est requis.'),
  receiverPhoneNumber: yup.string().nullable(),
  receiverEmail: yup.string().email('Veuillez entrer un email valide').nullable(),
});

export default function AppViewBusinessViewDashboardViewAddressBookModalViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { addressId } = routeApi.useParams();

  const { data: address } = useSuspenseQuery(queries.address.detail._ctx.byId(addressId));

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateAddress(address, {
        addressLineOne: data.receiverAddressOne,
        addressLineTwo: data.receiverAddressTwo,
        city: data.receiverCity,
        fullName: data.receiverName ?? '',
        zipCode: data.receiverZipCode,
        email: data.receiverEmail ?? '',
        phoneNumber: data.receiverPhoneNumber,
        enterpriseId: address!.enterpriseId,
        enterpriseName: data.receiverCompanyName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.address._def });
      toast.success("L'adresse a bien été modifiée");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de l'adresse");
    },
  });

  useEffect(() => {
    setValue('receiverCompanyName', address.enterpriseName);
    setValue('receiverName', address.fullName);
    setValue('receiverAddressOne', address.addressLineOne);
    setValue('receiverAddressTwo', address.addressLineTwo);
    setValue('receiverZipCode', address.zipCode);
    setValue('receiverCity', address.city);
    setValue('receiverEmail', address.email);
    setValue('receiverPhoneNumber', address.phoneNumber);
  }, [address.id]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.new_address_book_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>{"Modifier l'adresse"}</div>
        </div>

        <div className={styles.modal_body}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="receiverCompanyName">Société</label>
              <input type="text" {...register('receiverCompanyName')} id="receiverCompanyName" placeholder="Nom de la société" />
              <p className={styles.__errors}>{errors.receiverCompanyName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverName">Nom complet</label>
              <input type="text" {...register('receiverName')} id="receiverName" placeholder="Nom" />
              <p className={styles.__errors}>{errors.receiverName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressOne">Adresse 1</label>
              <textarea rows={4} {...register('receiverAddressOne')} id="receiverAddressOne" placeholder="Adresse 1" />
              <p className={styles.__errors}>{errors.receiverAddressOne?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressTwo">Adresse 2</label>
              <textarea rows={4} {...register('receiverAddressTwo')} id="receiverAddressTwo" placeholder="Adresse 2" />
              <p className={styles.__errors}>{errors.receiverAddressTwo?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverZipCode">Code Postal</label>
              <input type="number" {...register('receiverZipCode')} id="receiverZipCode" placeholder="Code Postal" />
              <p className={styles.__errors}>{errors.receiverZipCode?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverCity">Ville</label>
              <input type="text" {...register('receiverCity')} id="receiverCity" placeholder="Ville" />
              <p className={styles.__errors}>{errors.receiverCity?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverPhoneNumber">Téléphone</label>
              <input {...register('receiverPhoneNumber')} type="tel" id="receiverPhoneNumber" placeholder="Téléphone" />
              <p className={styles.__errors}>{errors.receiverPhoneNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverEmail">Mail</label>
              <input type="email" {...register('receiverEmail')} id="receiverEmail" placeholder="Mail" />
              <p className={styles.__errors}>{errors.receiverEmail?.message}</p>
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
