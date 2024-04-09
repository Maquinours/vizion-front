import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Base64 } from 'js-base64';
import React from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './StepOne.module.scss';
import { generateTravelVoucher } from './utils/api/travelVoucher';

const routeApi = getRouteApi('/app/enterprises/create-contact-travel-voucher/$contactId');

const yupSchema = yup.object({
  businessNumber: yup.string().required('Champs requis'),
  companyName: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  name: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  note: yup.string().nullable(),
  addressOne: yup.string().required('Champs requis').max(40, 'Max 40 caratères'),
  addressTwo: yup.string().nullable().max(40, 'Max 40 caratères'),
  zipCode: yup.string().required('Champs requis'),
  city: yup.string().required('Champs requis'),
  phoneNumber: yup.string().nullable(),
  email: yup.string().email('Email invalide').nullable(),
  number: yup.number().typeError('Format invalide').min(1, 'Min 1').required('Champs requis'),
});

type AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponentProps = Readonly<{
  isOpen: boolean;
  setFiles: React.Dispatch<React.SetStateAction<Array<File> | undefined>>;
  onClose: () => void;
}>;
export default function AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponent({
  isOpen,
  setFiles,
  onClose,
}: AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepOneComponentProps) {
  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery(queries.profiles.detail(contactId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      email: contact.enterprise!.email,
      phoneNumber: contact.enterprise!.phoneNumber,
      city: contact.enterprise!.city ?? '',
      zipCode: contact.enterprise!.zipCode,
      addressOne: contact.enterprise!.addressLineOne,
      addressTwo: contact.enterprise!.addressLineTwo,
      name: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.enterprise!.name,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      businessNumber,
      companyName,
      name,
      note,
      addressOne,
      addressTwo,
      zipCode,
      city,
      phoneNumber,
      email,
      number,
    }: yup.InferType<typeof yupSchema>) =>
      generateTravelVoucher({
        businessNumber,
        companyName,
        name,
        note,
        addressOne,
        addressTwo,
        zipCode,
        city,
        phoneNumber,
        email,
        number,
      }),
    onSuccess: (data) => {
      setFiles(
        data.map(({ data }, index) => {
          const bstr = Base64.atob(data);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], `Bon_De_Transport_${index + 1}.pdf`, { type: 'application/pdf' });
        }),
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du bon de transport');
    },
  });

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Edition du BT </div>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_group}>
              <label htmlFor="number">N° Ref :</label>
              <input {...register('businessNumber')} id="number" type="text" />
              <p className={styles.__errors}>{errors.businessNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="note">Note :</label>
              <input {...register('note')} id="note" type="text" />
              <p className={styles.__errors}>{errors.note?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverCompanyName">Société :</label>
              <input {...register('companyName')} id="receiverCompanyName" type="text" />
              <p className={styles.__errors}>{errors.companyName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverName">Nom :</label>
              <input {...register('name')} id="receiverName" type="text" />
              <p className={styles.__errors}>{errors.name?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressOne">Adresse 1:</label>
              <input id="receiverAddressOne" {...register('addressOne')} type="text" />
              <p className={styles.__errors}>{errors.addressOne?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverAddressTwo">Adresse 2 :</label>
              <input {...register('addressTwo')} id="receiverAddressTwo" type="text" />
              <p className={styles.__errors}>{errors.addressTwo?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverZipCode">CP :</label>
              <input {...register('zipCode')} id="receiverZipCode" type="text" />
              <p className={styles.__errors}>{errors.zipCode?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverCity">Ville :</label>
              <input {...register('city')} id="receiverCity" type="text" />
              <p className={styles.__errors}>{errors.city?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverPhoneNumber">Téléphone :</label>
              <input {...register('phoneNumber')} id="receiverPhoneNumber" type="tel" />
              <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="receiverEmail">Mail :</label>
              <input type="email" {...register('email')} id="receiverEmail" />
              <p className={styles.__errors}>{errors.email?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="nbreColis">Nombre de colis :</label>
              <input type="number" {...register('number')} id="nbreColis" />
              <p className={styles.__errors}>{errors.number?.message}</p>
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
