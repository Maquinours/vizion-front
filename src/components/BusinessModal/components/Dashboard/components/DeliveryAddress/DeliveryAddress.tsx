import { FieldErrors, UseFormRegister } from 'react-hook-form';
import styles from './DeliveryAddress.module.scss';
import { BusinessDashboardFormType } from '../../Dashboard';
import CardComponent from '../../../../../Card/Card';

type BusinessModalComponentDashboardComponentDeliveryAddressComponentProps = Readonly<{
  register: UseFormRegister<BusinessDashboardFormType>;
  errors: FieldErrors<BusinessDashboardFormType>;
}>;
export default function BusinessModalComponentDashboardComponentDeliveryAddressComponent({
  register,
  errors,
}: BusinessModalComponentDashboardComponentDeliveryAddressComponentProps) {
  return (
    <div className={styles.container}>
      <CardComponent title="Adresse de livraison ou contact" className="h-full">
        <div className={styles.content}>
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
        </div>
      </CardComponent>
    </div>
  );
}
