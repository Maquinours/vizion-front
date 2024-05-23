import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createAddress } from '../../../../../../../../utils/api/address';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './CreateModal.module.scss';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book/create');

const yupSchema = yup.object({
  enterpriseName: yup.string().required('Champs requis.'),
  fullName: yup.string().typeError('Format invalide').required('Nom requis'),
  addressOne: yup.string().required('Champs est requis.'),
  addressTwo: yup.string().nullable(),
  zipCode: yup
    .string()
    .required('Le code postal est requis')
    .matches(/([A-Z0-9]{5})$/, {
      message: 'Format invalide (doit contenir 05 caracteres (95012 / 2A256)',
      excludeEmptyString: true,
    }),
  city: yup.string().required('Champs est requis.'),
  phoneNumber: yup.string().nullable(),
  email: yup.string().email('Veuillez entrer un email valide').required("L'email est requis"),
  searchValue: yup.string().nullable(),
});

export default function AppViewEnterpriseViewAddressBookModalViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      createAddress({
        addressLineOne: data.addressOne,
        addressLineTwo: data.addressTwo,
        city: data.city,
        fullName: data.fullName,
        zipCode: data.zipCode,
        email: data.email,
        phoneNumber: data.phoneNumber,
        enterpriseId,
        enterpriseName: data.enterpriseName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.address._def });
      onClose();
      toast.success('Adresse ajoutée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'adresse");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Ajouter une adresse</div>
        </div>

        <div className={styles.modal_body}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="receiverCompanyName">Société</label>
              <input type="text" {...register('enterpriseName')} id="receiverCompanyName" placeholder="Nom de la société" />
              <p className={styles.__errors}>{errors.enterpriseName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverName">Nom complet</label>
              <input type="text" {...register('fullName')} id="receiverName" placeholder="Nom" />
              <p className={styles.__errors}>{errors.fullName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressOne">Adresse 1</label>
              <textarea rows={4} {...register('addressOne')} id="receiverAddressOne" placeholder="Adresse 1" />
              <p className={styles.__errors}>{errors.addressOne?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressTwo">Adresse 2</label>
              <textarea rows={4} {...register('addressTwo')} id="receiverAddressTwo" placeholder="Adresse 2" />
              <p className={styles.__errors}>{errors.addressTwo?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverZipCode">Code Postal</label>
              <input type="number" {...register('zipCode')} id="receiverZipCode" placeholder="Code Postal" />
              <p className={styles.__errors}>{errors.zipCode?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverCity">Ville</label>
              <input type="text" {...register('city')} id="receiverCity" placeholder="Ville" />
              <p className={styles.__errors}>{errors.city?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverPhoneNumber">Téléphone</label>
              <input {...register('phoneNumber')} type="tel" id="receiverPhoneNumber" placeholder="Téléphone" />
              <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverEmail">Mail</label>
              <input type="email" {...register('email')} id="receiverEmail" placeholder="Mail" />
              <p className={styles.__errors}>{errors.email?.message}</p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '1rem 0',
              }}
            >
              <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.footer_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-secondary" type="submit">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
