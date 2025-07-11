import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import BusinessBpResponseDto from '../../../../../../../../utils/types/BusinessBpResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import { generateBusinessBpTravelVoucher } from '../../../../../../../../views/App/views/Enterprises/views/CreateContactTravelVoucherModal/components/StepOne/utils/api/travelVoucher';
import styles from './FormModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp/travel-voucher');

const yupSchema = yup.object().shape({
  businessName: yup.string().required('Champs requis.').trim(),
  businessInstaller: yup.string().nullable().trim(),
  businessDeliveryMode: yup.string().nullable().trim(),
  receiverName: yup.string().required('Champs requis').max(40, 'Max 40 caratères').trim(),
  receiverCompanyName: yup.string().required('Champs requis').max(40, 'Max 40 caratères').trim(),
  receiverAddressTwo: yup.string().nullable().max(40, 'Max 40 caratères').trim(),
  receiverAddressOne: yup.string().required('Champs requis').max(40, 'Max 40 caratères').trim(),
  receiverZipCode: yup.string().required('Champs requis').trim(),
  receiverCity: yup.string().required('Champs requis').trim(),
  receiverPhoneNumber: yup.string().nullable().trim(),
  receiverEmail: yup.string().email('Email invalide').nullable().trim(),
  nbreColis: yup.number().typeError('Format invalide').min(1, 'Min 1').required('Champs requis'),
});

type BusinessModalComponentBpComponentTravelVoucherModalComponentFormModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
  show: boolean;
  onGenerated: (files: Array<File>) => void;
  onClose: () => void;
}>;
export default function BusinessModalComponentBpComponentTravelVoucherModalComponentFormModalComponent({
  business,
  bp,
  show,
  onGenerated,
  onClose,
}: BusinessModalComponentBpComponentTravelVoucherModalComponentFormModalComponentProps) {
  // const navigate = routeApi.useNavigate();

  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      businessName: business.title ?? '',
      businessInstaller: business.installerProfileName ?? '',
      businessDeliveryMode: business.deliveryMode ?? '',
      receiverCompanyName: business.deliverAddressCompany ?? '',
      receiverName: business.deliverAddressName || 'Réception',
      receiverAddressTwo: business.deliverAddressTwo,
      receiverAddressOne: business.deliverAddressOne ?? '',
      receiverZipCode: business.deliverAddressZipCode ?? '',
      receiverCity: business.deliverAddressCity ?? '',
      receiverPhoneNumber: business.deliverPhoneNumber,
      receiverEmail: business.deliverEmail ?? '',
      nbreColis: 1,
    },
  });

  // const onClose = () => {
  //   navigate({ to: '..', search: true, replace: true, resetScroll: false });
  // };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: yup.InferType<typeof yupSchema>) => {
      const res = await generateBusinessBpTravelVoucher(bp.id, {
        companyName: data.receiverCompanyName,
        name: data.receiverName,
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
