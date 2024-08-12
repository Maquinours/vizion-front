import ReactModal from 'react-modal';
import styles from './FormModal.module.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import AssistanceResponseDto from '../../../../../../../../../../utils/types/AssistanceResponseDto';
import { PulseLoader } from 'react-spinners';
import { useMutation } from '@tanstack/react-query';
import { generateTravelVoucher } from '../../../../../../../Enterprises/views/CreateContactTravelVoucherModal/components/StepOne/utils/api/travelVoucher';
import { toast } from 'react-toastify';

const yupSchema = yup.object().shape({
  number: yup.string().required('Champs requis'),
  note: yup.string().nullable(),
  receiverZipCode: yup.string().required('Champs requis'),
  receiverCity: yup.string().required('Champs requis'),
  receiverName: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  receiverCompanyName: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  receiverAddressTwo: yup.string().nullable().max(40, 'Max 40 caratères'),
  receiverAddressOne: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),

  receiverPhoneNumber: yup.string().nullable(),
  receiverEmail: yup.string().email('Email invalide').nullable(),
  nbreColis: yup.number().typeError('Format invalide').min(1, 'Min 1').required('Champs requis'),
});

type AppViewRmaViewDeliveryViewTravelVoucherModalViewFormModalComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  show: boolean;
  onClose: () => void;
  onGenerated: (data: Array<File>) => void;
}>;
export default function AppViewRmaViewDeliveryViewTravelVoucherModalViewFormModalComponent({
  rma,
  show,
  onClose,
  onGenerated,
}: AppViewRmaViewDeliveryViewTravelVoucherModalViewFormModalComponentProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      number: '',
      note: '',
      receiverCompanyName: '',
      receiverName: '',
      receiverAddressTwo: '',
      receiverAddressOne: '',
      receiverZipCode: '',
      receiverCity: '',
      receiverPhoneNumber: '',
      receiverEmail: '',
      nbreColis: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: yup.InferType<typeof yupSchema>) => {
      const res = await generateTravelVoucher({
        businessNumber: data.number,
        companyName: data.receiverCompanyName,
        name: data.receiverName,
        note: data.note,
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

  useEffect(() => {
    setValue('number', rma.number);
    setValue('receiverEmail', rma.addressEmail);
    setValue('receiverPhoneNumber', rma.addressPhone);
    setValue('receiverCity', rma.addressCity ?? '');
    setValue('receiverZipCode', rma.addressZipCode ?? '');
    setValue('receiverAddressOne', rma.addressOne ?? '');
    setValue('receiverAddressTwo', rma.addressTwo);
    setValue('receiverName', rma.addressName ?? '');
    setValue('receiverCompanyName', rma.addressCompanyName ?? '');
  }, [rma.id]);

  return (
    <ReactModal isOpen={show} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Édition du BT </div>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_group}>
              <label htmlFor="number">N° Ref :</label>
              <input {...register('number')} id="number" type="text" />
              <p className={styles.__errors}>{errors.number?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="note">Note :</label>
              <input {...register('note')} id="note" type="text" />
              <p className={styles.__errors}>{errors.note?.message}</p>
            </div>
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
              <input type="number" {...register('nbreColis')} id="nbreColis" />
              <p className={styles.__errors}>{errors.nbreColis?.message}</p>
            </div>
            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.form_buttons}>
              <div className={styles.buttons_container}>
                <button type="reset" className="btn btn-primary">
                  Annuler
                </button>
                <button type="submit" disabled={isPending} className="btn btn-secondary">
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
