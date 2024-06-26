import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { generateTravelVoucher } from '../../../../../../../Enterprises/views/CreateContactTravelVoucherModal/components/StepOne/utils/api/travelVoucher';
import styles from './FormModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp/travel-voucher');

const yupSchema = yup.object().shape({
  businessName: yup.string().required('Champs requis.'),
  businessInstaller: yup.string().nullable(),
  businessExport: yup.string().required(),
  businessBlockBill: yup.string().required(),
  businessDeliveryMode: yup.string().nullable(),
  receiverName: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  receiverCompanyName: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  receiverAddressTwo: yup.string().nullable().max(40, 'Max 40 caratères'),
  receiverAddressOne: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  receiverZipCode: yup.string().required('Champs requis'),
  receiverCity: yup.string().required('Champs requis'),
  receiverPhoneNumber: yup.string().nullable(),
  receiverEmail: yup.string().email('Email invalide').nullable(),
  nbreColis: yup.number().typeError('Format invalide').min(1, 'Min 1').required('Champs requis'),
});

type AppViewBusinessViewBpViewTravelVoucherModalViewFormModalComponentProps = Readonly<{
  show: boolean;
  onGenerated: (files: Array<File>) => void;
}>;
export default function AppViewBusinessViewBpViewTravelVoucherModalViewFormModalComponent({
  show,
  onGenerated,
}: AppViewBusinessViewBpViewTravelVoucherModalViewFormModalComponentProps) {
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
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: yup.InferType<typeof yupSchema>) => {
      const res = await generateTravelVoucher({
        businessNumber: business.numBusiness,
        companyName: data.receiverCompanyName,
        name: data.receiverName,
        note: business.title?.slice(0, 50),
        addressOne: data.receiverAddressOne,
        addressTwo: data.receiverAddressTwo,
        zipCode: data.receiverZipCode,
        city: data.receiverCity,
        phoneNumber: data.receiverPhoneNumber,
        email: data.receiverEmail,
        number: data.nbreColis,
      });
      const blobs = await Promise.all(res.map(async (item) => (await fetch(`data:application/pdf;base64,${item.data}`)).blob()));
      return blobs.map((blob, index) => new File([blob], `Bon_De_Transport[${index}].pdf`, { type: blob.type }));
    },
    onSuccess: (data) => {
      onGenerated(data);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du BT');
    },
  });

  return (
    <ReactModal isOpen={show} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Edition du BT </div>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_group}>
              <label htmlFor="receiverCompanyName">Société :</label>
              <input {...register('receiverCompanyName')} id="receiverCompanyName" type="text" />
              <p className={styles.__errors}>{errors.receiverCompanyName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverName">Nom :</label>
              <input {...register('receiverName')} id="receiverName" type="text" />
              <p className={styles.__errors}>{errors.receiverName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressOne">Adresse 1:</label>
              <input id="receiverAddressOne" {...register('receiverAddressOne')} type="text" />
              <p className={styles.__errors}>{errors.receiverAddressOne?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressTwo">Adresse 2 :</label>
              <input {...register('receiverAddressTwo')} id="receiverAddressTwo" type="text" />
              <p className={styles.__errors}>{errors.receiverAddressTwo?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverZipCode">CP :</label>
              <input {...register('receiverZipCode')} id="receiverZipCode" type="text" />
              <p className={styles.__errors}>{errors.receiverZipCode?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverCity">Ville :</label>
              <input {...register('receiverCity')} id="receiverCity" type="text" />
              <p className={styles.__errors}>{errors.receiverCity?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverPhoneNumber">Téléphone :</label>
              <input {...register('receiverPhoneNumber')} id="receiverPhoneNumber" type="tel" />
              <p className={styles.__errors}>{errors.receiverPhoneNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverEmail">Mail :</label>
              <input type="email" {...register('receiverEmail')} id="receiverEmail" />
              <p className={styles.__errors}>{errors.receiverEmail?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="nbreColis">Nombre de colis :</label>
              <input type="number" {...register('nbreColis')} id="nbreColis" min={0} />
              <p className={styles.__errors}>{errors.nbreColis?.message}</p>
            </div>
            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.form_buttons}>
              <div className={styles.buttons_container}>
                <button className="btn btn-primary" type="reset">
                  Annuler
                </button>
                <button className="btn btn-secondary" type="submit">
                  Imprimer BT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
